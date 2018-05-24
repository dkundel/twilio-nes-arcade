import React, { Component } from 'react';
import { NES } from 'jsnes';

import Screen from './Screen';

const GAME_URL =
  'https://d3cto2l652k3y0.cloudfront.net/Super%20Mario%20Bros.%20(JU)%20(PRG0)%20[!].nes';
const DEFAULT_SPEED = 1;

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      speed: DEFAULT_SPEED
    };
    this.renderGameFrame = this.renderGameFrame.bind(this);
  }
  async loadRom() {
    // I should change this to fetch. This is taken from the jsnes-web project
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();
      req.open('GET', GAME_URL);
      req.overrideMimeType('text/plain; charset=x-user-defined');
      req.onload = function() {
        if (this.status === 200) {
          resolve(this.responseText);
        } else if (this.status === 0) {
          // Aborted, so ignore error
        } else {
          reject(new Error(req.statusText));
        }
      };
      req.onerror = function() {
        reject(new Error(req.statusText));
      };
      req.send();
    });
  }

  async componentDidMount() {
    this.romData = await this.loadRom();
    this.nes = new NES({
      onFrame: this.screen.setBuffer,
      onStatusUpdate: console.log
    });
    this.nes.loadROM(this.romData);
    console.log(this.nes.toJSON());
    this.nes.frame();
    window.requestAnimationFrame(this.renderGameFrame);
  }

  renderGameFrame() {
    // Skip frames depending on the speed (for speed runs)
    for (let x = 0; x < this.state.speed; x++) {
      this.nes.frame();
    }

    this.screen.writeBuffer();
    window.requestAnimationFrame(this.renderGameFrame);
  }

  render() {
    return (
      <div>
        <Screen ref={screen => (this.screen = screen)} />
      </div>
    );
  }
}

export default Game;
