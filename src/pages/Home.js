import React, { Component } from 'react';
import styled from 'styled-components';
import {
  ActionLink,
  Link,
  Text as DefaultText,
  Title
} from '../components/common';

const Text = styled(DefaultText)`
  font-size: 1.2em;
`;

const Subtitle = Title.withComponent('h3');

const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;

  > * {
    max-width: 1000px;
  }
`;

const CallToAction = styled.div`
  margin-top: 40px;
  margin-bottom: 60px;
`;

class Home extends Component {
  render() {
    return (
      <Container>
        <div>
          <Title>Welcome to Twilio Arcade!</Title>
          <Text>
            Control Super Mario Bros. by using a sequence of emojis or
            characters and win prizes.
          </Text>
          <Text>
            To win prizes, try to create a sequence of characters/emojis that
            reaches a high score on the playground. Then afterwards submit the
            score via SMS or via Twitter.
          </Text>
          <Text>
            We are only using your phone number as a game input and will redact
            all phone numbers & messages after the event.
          </Text>
          <Text>
            Your submission will be queued to run at the main screen in the
            Twilio booth at the event as soon as you submit it. If you crack a
            new high score you'll end up on the leaderboard.
          </Text>
          <Text>
            If you make it on the leaderboard, come to the Twilio booth members
            and pick up your prize!
          </Text>
        </div>
        <CallToAction>
          <ActionLink href="/try">Go to Playground</ActionLink>
        </CallToAction>
        <div>
          <Subtitle>About the Game</Subtitle>
          <Text>
            This emulator itself is powered by a library called{' '}
            <Link href="https://npm.im/jsnes">jsnes</Link>.
          </Text>
          <Text>
            The leaderboard and submissions are handled by{' '}
            <Link href="https://twilio.com/sync">Twilio Sync</Link>.
          </Text>
          <Text>
            All submissions via SMS are directly handled by{' '}
            <Link href="https://twilio.com/sms">Twilio Programmable SMS</Link>{' '}
            and a{' '}
            <Link href="https://twilio.com/functions">Twilio Function</Link>.
          </Text>
          <Text>
            Twitter submissions to #twilioArcade are grabbed by Zappier and then
            forwarded to the same Twilio Function webhook.
          </Text>
          <Text>
            The entire source code including the two Twilio Functions can be
            found on{' '}
            <Link href="https://github.com/dkundel/twilio-nes-arcade">
              GitHub
            </Link>
          </Text>
        </div>
      </Container>
    );
  }
}

export default Home;
