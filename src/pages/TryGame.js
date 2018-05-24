import React, { Component } from 'react';
import Game from '../components/Game';

class TryGame extends Component {
  render() {
    return (
      <div>
        <h1>Try your fate</h1>
        <Game />
      </div>
    );
  }
}

export default TryGame;
