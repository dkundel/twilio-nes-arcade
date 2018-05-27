import React, { Component } from 'react';
import styled from 'styled-components';
import { get as emoji } from 'node-emoji';

import { Title, ActionButton, Button, Text } from '../components/common';
import Game from '../components/Game';
import { AVAILABLE_BUTTONS, RAW_MAP } from '../utils/input';
import { GameManualText } from '../utils/text';

const Container = styled.div`
  box-sizing: border-box;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr 1fr;
  grid-template-areas:
    'header header'
    'game    input'
    'game controls'
    'manual manual';
  grid-gap: 20px;
  padding: 20px;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto 400px 400px;
    grid-template-areas:
      'header'
      'game'
      'input'
      'controls'
      'manual';
    padding: 0px;
  }
`;

const TitleContainer = styled.div`
  grid-area: header;
  text-align: center;
`;

const Subtitle = styled(Text)`
  font-size: 1.3em;
`;

const ControlContainer = styled.div`
  grid-area: controls;
  display: grid;
  grid-gap: 10px;
  grid-template: repeat(3, 1fr) / repeat(3, 1fr);
`;

const ControlButton = styled(Button)`
  font-size: 2em;
`;

const InputContainer = styled.div`
  grid-area: input;

  display: flex;
  flex-direction: column;
`;

const RunButton = styled(ActionButton)`
  display: block;
  width: 100%;
  margin-top: 10px;
`;

const CommandInput = styled.textarea`
  color: #fff;
  text-shadow: 2px 2px 0px #000;
  flex: 1;
  background-color: rgba(255, 255, 255, 0.2);
  font-size: 1.5em;
  padding: 10px;
`;

const GameContainer = styled.div`
  grid-area: game;
`;

const ManualContainer = styled.div`
  grid-area: manual;
`;

const ManualTitle = styled(Title.withComponent('h2'))``;

const ControlList = styled.ul``;

const ControlListOption = styled(Text.withComponent('li'))`
  span {
  }
`;

class TryGame extends Component {
  constructor(props) {
    super(props);
    let buttonSeries = '';
    if (localStorage) {
      buttonSeries = localStorage.getItem('buttonSeries') || '';
    }

    this.state = {
      buttonSeries
    };

    this.addEmoji = this.addEmoji.bind(this);
    this.updateTextBox = this.updateTextBox.bind(this);
    this.resetGame = this.resetGame.bind(this);
    this.runGame = this.runGame.bind(this);
    this.gameOver = this.gameOver.bind(this);
    this.speedRunGame = this.speedRunGame.bind(this);
  }

  addEmoji(evt) {
    const value = evt.target.innerText;
    const buttonSeries = this.state.buttonSeries + value;
    localStorage.setItem('buttonSeries', buttonSeries);
    this.setState({ buttonSeries });
  }

  updateTextBox(evt) {
    const buttonSeries = evt.target.value;
    localStorage.setItem('buttonSeries', buttonSeries);
    this.setState({ buttonSeries });
  }

  resetGame() {
    this.game.restart();
  }

  runGame() {
    this.game.setButtons(this.state.buttonSeries);
    this.game.restart();
  }

  speedRunGame() {
    this.game.setSpeed(5);
    this.game.setButtons(this.state.buttonSeries);
    this.game.restart();
  }

  gameOver({ score, coins }) {
    console.log(
      '%c GAME OVER. Score %d, Coins %d',
      'font-size:3em;color:red;',
      score,
      coins
    );
  }

  renderControls() {
    const entries = Object.keys(RAW_MAP).map(key => {
      const val = RAW_MAP[key];
      if (key.startsWith(':')) {
        key = emoji(key);
      }
      return (
        <ControlListOption key={key}>
          {key}: <span>{val}</span>
        </ControlListOption>
      );
    });
    return <ControlList>{entries}</ControlList>;
  }

  render() {
    return (
      <Container>
        <TitleContainer>
          <Title>Playground</Title>
          <Subtitle>
            Try out your moves before submitting them to the competition.
          </Subtitle>
        </TitleContainer>
        <GameContainer>
          <Game ref={game => (this.game = game)} gameOver={this.gameOver} />
        </GameContainer>
        <InputContainer>
          <CommandInput
            value={this.state.buttonSeries}
            onChange={this.updateTextBox}
          />
          <RunButton onClick={this.runGame}>Run Game</RunButton>
          <RunButton onClick={this.speedRunGame}>Run Game (5x Speed)</RunButton>
        </InputContainer>
        <ControlContainer>
          {AVAILABLE_BUTTONS.map(emoji => (
            <ControlButton onClick={this.addEmoji} key={emoji}>
              {emoji}
            </ControlButton>
          ))}
        </ControlContainer>
        <ManualContainer>
          <ManualTitle>Manual</ManualTitle>
          {GameManualText.split('---').map((t, idx) => (
            <Text key={idx}>{t}</Text>
          ))}
          <ManualTitle>Controls</ManualTitle>
          <Text>The following options are available:</Text>
          {this.renderControls()}
          <Text>
            You can also use numbers to multiple the respective following
            character/emoji.
          </Text>
          <ManualTitle>Examples</ManualTitle>
          <Text>
            Option 1: <br />
            ➡️➡️➡️➡️➡️➡️➡️➡️⬅️⬅️⬅️➡️➡️🚀
          </Text>
          <Text>
            Option 2: <br />
            8➡️3⬅️➡️➡️🚀
          </Text>
        </ManualContainer>
      </Container>
    );
  }
}

export default TryGame;
