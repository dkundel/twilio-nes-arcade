import { stripIndent } from 'common-tags';

export const GameManualText = stripIndent`
  Control the game via emojis or text! Enter a series of the commands described 
  below into the input field and press "Run Game". The game will execute the 
  commands and tell you the score afterwards. 
---
  Once you are ready. Submit the score by sending a text to: +xxxxxxxxxx or 
  by tweeting it with #TwilioArcade. It will be executed at the main screen
  in the Twilio Booth and potentially make it onto the Leaderboard.
---
  We will use your phone number only as game input and all messages and 
  phone numbers will be redacted after the event.
`;
