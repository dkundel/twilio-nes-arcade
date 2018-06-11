// Generates an access token for Twilio Sync
// Hosted on /arcade-token

exports.handler = function(context, event, callback) {
  // make sure you enable ACCOUNT_SID and AUTH_TOKEN in Functions/Configuration
  const ACCOUNT_SID = context.ACCOUNT_SID;

  // you can set these values in Functions/Configuration or set them here
  const SERVICE_SID = context.ARCADE_SERVICE || 'enter Sync Service SID';
  const API_KEY = context.API_KEY || 'enter API Key';
  const API_SECRET = context.API_SECRET || 'enter API Secret';

  // REMINDER: This identity is only for prototyping purposes
  const IDENTITY = 'leaderboard';

  const AccessToken = Twilio.jwt.AccessToken;
  const SyncGrant = AccessToken.SyncGrant;

  const syncGrant = new SyncGrant({
    serviceSid: SERVICE_SID
  });

  const accessToken = new AccessToken(ACCOUNT_SID, API_KEY, API_SECRET);

  accessToken.addGrant(syncGrant);
  accessToken.identity = IDENTITY;

  const response = new Twilio.Response();

  // Set cross origin headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  // Set headers in response
  response.setBody({ token: accessToken.toJwt() });
  response.setHeaders(headers);

  callback(null, response);
};
