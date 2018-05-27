import React, { Component } from 'react';
import styled from 'styled-components';
import { Text, Title } from '../components/common';
import Game from '../components/Game';
import ResultScreen from '../components/ResultScreen';
import RawScoreList from '../components/ScoreList';

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: auto minmax(500px, 1fr) auto;
  grid-template-areas:
    'title title'
    'game scores'
    'run     run';
  grid-gap: 20px;
  max-height: 100%;
`;

const Headline = styled(Title)`
  grid-area: title;
  margin-bottom: 0;
  font-size: 1.4em;
`;

const RunContainer = styled.div`
  grid-area: run;
`;

const SmallTitle = styled(Title.withComponent('h3'))``;

const RunText = styled(Text)`
  font-size: 1.2em;
`;

const ScoreList = styled(RawScoreList)`
  grid-area: scores;
`;

const GameContainer = styled.div`
  grid-area: game;
`;

const GameResultContainer = styled(GameContainer)`
  z-index: 999;
`;

class Leaderboard extends Component {
  constructor(param) {
    super(param);
    this.state = {
      currentRun: {
        name: 'Dominik',
        instructions:
          '8➡️3⬅️➡️➡️🚀➡️4🚀➡️➡️3🚀➡️⬅️➡️🚀3➡️3⬅️🚀🕐🕐🚀4➡️🚀🚀➡️3🕐➡️➡️🚀🚀5🕐3➡️🚀🚀5🕐➡️15🕐🚀4➡️🚀🚀🚀➡️➡️'
      },
      showScore: true,
      lastResult: {
        score: 0,
        coins: 0,
        time: 0
      },
      leaderboard: []
    };
    this.finishedRun = this.finishedRun.bind(this);

    window.testRun = this.executeRun.bind(this);
  }

  executeRun() {
    this.setState({ showScore: false });
    this.game.setSpeed(10);
    this.game.setButtons(this.state.currentRun.instructions);
    this.game.restart();
  }

  finishedRun(result) {
    this.setState({
      showScore: true,
      lastResult: result,
      currentRun: { name: '', instructions: '' }
    });
  }

  render() {
    const { leaderboard, currentRun, showScore, lastResult } = this.state;
    return (
      <Container>
        <Headline>Start at: arcade.twilio.rocks</Headline>
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
