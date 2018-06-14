import EventEmitter from 'event-emitter';
import { AccessManager } from 'twilio-common';
import { SyncClient } from 'twilio-sync';

class DataClient {
  constructor(tokenUrl) {
    // super();
    this.tokenUrl = tokenUrl;
  }

  async init() {
    const token = await this.fetchToken();
    this.createAccessManager(token);
    this.createClient(token);
    this.submissionsList = await this.client.list('arcade_submissions');
    this.arcadeConfigDoc = await this.client.document('arcade_config');
    this.arcadeConfig = this.arcadeConfigDoc.value;
    await this.fetchSubmissions();
    this.addEventListeners();
    return this;
  }

  getLeaderboard() {
    return this.arcadeConfig.leaderboard;
  }

  convertItemToObject(item) {
    return { ...item.value, id: item.index };
  }

  getNext() {
    if (!Array.isArray(this.submissions)) {
      return null;
    }

    this.submissions = this.submissions.filter(x => !!x.instructions);

    if (this.submissions.length < 1) {
      return null;
    }

    const next = this.submissions[0];
    return next;
  }

  async fetchSubmissions() {
    const { items } = await this.submissionsList.getItems({ pageSize: 100 });
    this.submissions = items.map(item => this.convertItemToObject(item));
    return this.submissions;
  }

  addEventListeners() {
    this.submissionsList.on('itemAdded', item => {
      console.log(item);
      this.submissions = [...this.submissions, this.convertItemToObject(item)];
      this.emit('newSubmission', { submissions: this.submissions });
    });

    const updateListManually = async () => {
      this.submissions = await this.fetchSubmissions();
      this.isUpdating = false;
      this.emit('updatedSubmission', { submissions: this.submissions });
    };
    this.submissionsList.on('itemRemoved', updateListManually);
    this.submissionsList.on('itemUpdated', updateListManually);

    this.arcadeConfigDoc.on('updated', value => {
      this.arcadeConfig = value;
      this.emit('configUpdate', { config: value });
    });

    this.arcadeConfigDoc.on('updatedRemotely', ({ value }) => {
      console.log(value, arguments);
      this.arcadeConfig = value;
      this.emit('configUpdate', { config: value });
    });
  }

  updateLeaderboard(leaderboard) {
    this.arcadeConfigDoc.update({ leaderboard });
  }

  async removeSubmission(id) {
    console.log('delete', id);
    this.isUpdating = true;
    await this.submissionsList.remove(id);
    this.submissions = this.submissions.splice(1);
  }

  async fetchToken() {
    const resp = await fetch(this.tokenUrl);
    if (!resp) {
      throw new Error('Failed to fetch token');
    }

    const { token } = await resp.json();
    return token;
  }

  createAccessManager(token) {
    const accessManager = new AccessManager(token);
    accessManager.on('tokenExpired', async () => {
      const token = await this.fetchToken();
      accessManager.updateToken(token);
    });
    accessManager.on('tokenUpdated', () => {
      this.client.updateToken(accessManager.token);
    });
  }

  async createClient(token) {
    this.client = new SyncClient(token);
    this.client.on('connectionStateChanged', ({ connectionState }) => {
      if (
        connectionState === 'disconnected' ||
        connectionState === 'error' ||
        connectionState === 'denied'
      ) {
        this.emit('disconnected');
        this.client = null;
      }
    });
    return this.client;
  }
}
EventEmitter(DataClient.prototype);

export default DataClient;
