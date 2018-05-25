import React, { Component } from 'react';
import { Controller } from 'jsnes';
import Game from '../components/Game';

class TryGame extends Component {
  constructor(props) {
    super(props);
    this.resetGame = this.resetGame.bind(this);
    this.setButtons = this.setButtons.bind(this);
  }

  resetGame() {
    this.game.reset();
  }

  setButtons() {
    const buttons = '➡️➡️🚀⬅️⬅️';
    this.game.setButtons(buttons);
    this.game.reset();
  }

  render() {
    return (
      <div>
        <h1>Try your fate</h1>
        <Game ref={game => (this.game = game)} />
        <div>
          <input type="text" name="buttonSeries" />
          <button onClick={this.setButtons}>Set Buttons</button>
          <button onClick={this.resetGame}>Reset Game</button>
        </div>
      </div>
    );
  }
}

export default TryGame;
