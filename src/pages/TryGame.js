import React, { Component } from 'react';
import { Controller } from 'jsnes';
import Game from '../components/Game';

const AVAILABLE_BUTTONS = ['⬆️', '➡️', '⬅️', '⬇️', '🚀', '✊', '✋', '👉'];

class TryGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonSeries: ''
    };

    this.addEmoji = this.addEmoji.bind(this);
    this.updateTextBox = this.updateTextBox.bind(this);
    this.resetGame = this.resetGame.bind(this);
    this.setButtons = this.setButtons.bind(this);
  }

  addEmoji(evt) {
    const value = evt.target.innerText;
    const buttonSeries = this.state.buttonSeries + value;
    this.setState({ buttonSeries });
  }

  updateTextBox(evt) {
    const buttonSeries = evt.target.value;
    this.setState({ buttonSeries });
  }

  resetGame() {
    this.game.reset();
  }

  setButtons() {
    this.game.setButtons(this.state.buttonSeries);
    this.game.reset();
  }

  render() {
    return (
      <div>
        <h1>Try your fate</h1>
        <Game ref={game => (this.game = game)} />
        <div>
          <input
            type="text"
            name="buttonSeries"
            value={this.state.buttonSeries}
            onChange={this.updateTextBox}
          />
          <button onClick={this.setButtons}>Set Buttons</button>
          <button onClick={this.resetGame}>Reset Game</button>
        </div>
        <div>
          {AVAILABLE_BUTTONS.map(emoji => (
            <button onClick={this.addEmoji} key={emoji}>
              {emoji}
            </button>
          ))}
        </div>
      </div>
    );
  }
}

export default TryGame;
