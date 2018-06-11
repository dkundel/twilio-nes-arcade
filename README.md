# 🎮 Twilio NES Arcade

Play NES games by controlling them via emojis. 

## Tech

- This emulator itself is powered by a library called [`jsnes`](https://npm.im/jsnes).
- The leaderboard and submissions are handled by [Twilio Sync](https://twilio.com/sync).
- All submissions via SMS are directly handled by [Twilio Programmable SMS](https://twilio.com/sms) and a Twilio Function.
- Twitter submissions to #twilioArcade are grabbed by Zappier and then forwarded to the same Twilio Function webhook.

## Requirements

- A Twilio Account - [sign up for free](https://twilio.com/try-twilio)

## Setup

1. Clone project:
```bash
git clone git@github.com:dkundel/twilio-nes-arcade.git
cd twilio-nes-arcade
npm install
```

2. Create a Twilio Sync Service in the [Twilio Console](https://www.twilio.com/console/sync/services) and note down the SID

3. Configure the following variables in your [Twilio Runtime](https://www.twilio.com/console/runtime/functions/configure):
- `ARCADE_SERVICE` - your Twilio Sync service you created
- `API_KEY` - A Twilio API key that you generated in the [Console](https://www.twilio.com/console/runtime/api-keys/create)
- `API_SECRET` - The respective secret to your API Key
- Enable `ACCOUNT_SID` for your functions

4. Create two Twilio functions based on the files in the [`functions/`](./functions/) directory and copy their paths.

5. Update `TOKEN_URL` in [`./src/pages/Leaderboard.js`](./src/pages/Leaderboard.js) with your Twilio Function URL

6. Configure a Twilio Phone Number to use your submission webhook for incoming messages as webhook

7. Run:

```bash
npm start # to start in development mode
npm run build # to create the output files into the build/ directory
```

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars3.githubusercontent.com/u/1505101?v=4" width="100px;"/><br /><sub><b>Dominik Kundel</b></sub>](https://dkundel.com)<br />[💻](https://github.com/dkundel/emoji-rating/commits?author=dkundel "Code") [🎨](#design-dkundel "Design") [🤔](#ideas-dkundel "Ideas, Planning, & Feedback") [👀](#review-dkundel "Reviewed Pull Requests") [📖](https://github.com/dkundel/emoji-rating/commits?author=dkundel "Documentation") |
| :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!

## License

GPL-3.0