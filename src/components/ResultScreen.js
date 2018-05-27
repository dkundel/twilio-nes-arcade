import React from 'react';
import styled from 'styled-components';

import { Title, Text } from './common';

const GameOver = styled(Title.withComponent('h3'))`
  font-size: 2em;
`;
const Score = styled(Title.withComponent('h4'))`
  font-size: 1.8em;
  margin-top: 0;
`;
const ScoreContainer = styled.div``;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  text-align: center;
  box-sizing: border-box;
`;

const ResultScreen = ({ score, coins }) => {
  return (
    <Container>
      <GameOver>Game Over!</GameOver>
      <ScoreContainer>
        <Text>Final Score:</Text>
        <Score>{score}</Score>
      </ScoreContainer>
      <ScoreContainer>
        <Text>Collected Coins:</Text>
        <Score>{coins}</Score>
      </ScoreContainer>
    </Container>
  );
};

export default ResultScreen;
