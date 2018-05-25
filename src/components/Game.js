import React, { Component } from 'react';
import { NES, Controller } from 'jsnes';

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
    this.gameLoop = this.gameLoop.bind(this);
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
    const romData = await this.loadRom();
    this.nes = new NES({
      onFrame: this.screen.setBuffer,
      onStatusUpdate: console.log
    });
    const memory = await (await fetch('/gameData.json')).json();
    memory.romData = romData;
    this.gameMemoryData = memory;
    this.initGame();
    this.buttons = [
      Controller.BUTTON_RIGHT,
      Controller.BUTTON_RIGHT,
      Controller.BUTTON_RIGHT,
      Controller.BUTTON_RIGHT,
      Controller.BUTTON_RIGHT,
      Controller.BUTTON_RIGHT,
      Controller.BUTTON_RIGHT,
      Controller.BUTTON_RIGHT,
      Controller.BUTTON_RIGHT,
      Controller.BUTTON_RIGHT,
      Controller.BUTTON_RIGHT
      // Controller.BUTTON_LEFT,
      // Controller.BUTTON_LEFT,
      // Controller.BUTTON_LEFT
    ];
    window.requestAnimationFrame(this.gameLoop);
  }

  gameLoop() {
    if (this.buttons[0]) {
      this.simulateButtonPress(this.buttons[0]);
      this.buttons = this.buttons.slice(1);
    }

    // Skip frames depending on the speed (for speed runs)
    for (let x = 0; x < this.state.speed; x++) {
      this.nes.frame();
    }

    this.screen.writeBuffer();
    window.requestAnimationFrame(this.gameLoop);
  }

  initGame() {
    this.nes.fromJSON(this.gameMemoryData);
    // this.skipGameScreen();
  }

  // skipGameScreen() {
  //   this.skipFrames(40);
  //   this.simulateButtonPress(Controller.BUTTON_START);
  //   this.skipFrames(120);
  // }

  skipFrames(skipCount) {
    for (let i = 0; i < skipCount; i++) {
      this.nes.frame();
    }
  }

  simulateButtonPress(button) {
    this.nes.buttonDown(1, button);
    this.skipFrames(60);
    this.nes.buttonUp(1, button);
  }

  render() {
    return (
      <div>
        <Screen ref={screen => (this.screen = screen)} />
        <div>
          <pre ref={debug => (this.debug = debug)} />
        </div>
      </div>
    );
  }
}

export default Game;
