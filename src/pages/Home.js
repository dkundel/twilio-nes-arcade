import React, { Component } from 'react';
import styled from 'styled-components';
import { ActionLink, Text as DefaultText, Title } from '../components/common';

const Text = styled(DefaultText)`
  font-size: 1.4em;
`;

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
      </Container>
    );
  }
}

export default Home;
