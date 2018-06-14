import React, { Component } from 'react';
import styled from 'styled-components';
import { Text, Title } from '../components/common';
import Game from '../components/Game';
import ResultScreen from '../components/ResultScreen';
import RawScoreList from '../components/ScoreList';
import DataClient from '../utils/data';

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: auto minmax(500px, 1fr) auto;
  grid-template-areas:
    'title title'
    'game scores'
    'run     run';
  /* grid-gap: 20px; */
  max-height: 100%;
`;

const Headline = styled(Title)`
  grid-area: title;
  margin-bottom: 20px;
  font-size: 1.4em;
`;

const RunContainer = styled.div`
  grid-area: run;
`;

const SmallTitle = styled(Title.withComponent('h3'))``;

const RunText = styled(Text)`
  font-size: 1.2em;
  word-wrap: break-word;
`;

const ScoreList = styled(RawScoreList)`
  grid-area: scores;
`;

const GameContainer = styled.div`
  grid-area: game;
  display: grid;
  background-color: #000;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
`;

const GameResultContainer = styled.div`
  grid-area: game;
  z-index: 999;
  margin-right: 20px;
`;

const TOKEN_URL = 'https://dramatic-sidewalk-3548.twil.io/arcade-token';

function sortDescending({ score: scoreA }, { score: scoreB }) {
  return scoreB - scoreA;
}

class Leaderboard extends Component {
  constructor(param) {
    super(param);
    this.state = {
      currentRun: {
        name: null,
        instructions: null,
        id: null
      },
      showScore: false,
      gameQueueStatus: 'idle',
      lastResult: {
        score: 0,
        coins: 0,
        time: 0
      },
      leaderboard: []
    };
    this.finishedRun = this.finishedRun.bind(this);
    this.setup = this.setup.bind(this);
  }

  async setup() {
    await this.client.init();
    this.setState({ leaderboard: this.client.getLeaderboard() });
  }

  checkAndLoadRun() {
    const next = this.client.getNext();
    if (next) {
      this.setState({
        gameQueueStatus: 'loaded',
        currentRun: next
      });
    }
  }

  async componentWillMount() {
    this.client = new DataClient(TOKEN_URL);
    await this.setup();

    this.client.on('disconnected', this.setup);

    this.client.on('configUpdate', ({ config }) => {
      this.setState({ leaderboard: config.leaderboard });
    });

    this.client.on('newSubmission', () => {
      console.log('new submission');
      if (this.state.gameQueueStatus === 'idle') {
        console.log('load it!');
        this.checkAndLoadRun();
      }
    });

    this.client.on('updatedSubmission', () => {
      if (this.state.gameQueueStatus === 'idle') {
        this.checkAndLoadRun();
      }
    });
    setTimeout(() => this.checkAndLoadRun(), 5000);
  }

  async componentDidUpdate(prevProps, prevState) {
    const hasChangedGameStatusTo = val => {
      return (
        prevState.gameQueueStatus !== val && this.state.gameQueueStatus === val
      );
    };

    if (hasChangedGameStatusTo('loaded')) {
      this.executeRun();
    }

    if (hasChangedGameStatusTo('idle')) {
      this.checkAndLoadRun();
    }
  }

  executeRun() {
    this.setState({ showScore: false, gameQueueStatus: 'running' });
    if (this.state.currentRun.instructions) {
      this.game.setSpeed(5);
      this.game.setButtons(this.state.currentRun.instructions);
      this.game.restart();
    }
  }

  async finishedRun(result) {
    const { id, name } = this.state.currentRun;
    await this.updateLeaderboard(result, name);
    await this.client.removeSubmission(id);
    this.setState({
      showScore: true,
      gameQueueStatus: 'idle',
      lastResult: { ...result, name },
      currentRun: {}
    });
  }

  async updateLeaderboard(result, name) {
    let { score, coins } = result;

    function isNotCurrentUser(existing) {
      if (existing.name !== name) {
        return true;
      }

      // this should be solved more elegantly
      // for now we'll just override the new score with the higher score
      if (existing.name === name && existing.score > score) {
        score = existing.score;
        coins = existing.coins;
      }
      return false;
    }
    const newLeaderboard = [
      ...this.state.leaderboard.filter(isNotCurrentUser),
      { score, name, coins }
    ]
      .sort(sortDescending)
      .splice(0, 10);
    await this.client.updateLeaderboard(newLeaderboard);
  }

  render() {
    const { leaderboard, currentRun, showScore, lastResult } = this.state;
    return (
      <Container>
        <Headline>
          Control Mario with emojis! Start at: arcade.twilio.rocks
        </Headline>
        <GameContainer>
          <Game
            ref={game => (this.game = game)}
            onGameOver={this.finishedRun}
          />
        </GameContainer>
        {showScore && (
          <GameResultContainer>
            <ResultScreen score={lastResult.score} coins={lastResult.coins} />
          </GameResultContainer>
        )}
        <RunContainer>
          <SmallTitle>Current run by: {currentRun.name}</SmallTitle>
          <RunText>{currentRun.instructions}</RunText>
        </RunContainer>
        <ScoreList entries={leaderboard} />
      </Container>
    );
  }
}

export default Leaderboard;
