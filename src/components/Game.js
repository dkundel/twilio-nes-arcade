import { NES } from 'jsnes';
import cloneDeep from 'lodash.clonedeep';
import React, { Component } from 'react';
import { parseInput } from '../utils/input';
import {
  getCoins,
  getCurrentLives,
  getScore,
  getTime
} from '../utils/marioMemory';
import Screen from './Screen';

const DEFAULT_SPEED = 1;
let GAME_URL = '/roms/mario.nes';
if (process.env.NODE_ENV !== 'production') {
  GAME_URL =
    'https://d3cto2l652k3y0.cloudfront.net/Super%20Mario%20Bros.%20(JU)%20(PRG0)%20[!].nes';
}

class Game extends Component {
  constructor(props) {
    super(props);
    this.speed = DEFAULT_SPEED;
    this.gameLoop = this.gameLoop.bind(this);
    this.layout = this.layout.bind(this);
    this.buttonInstructions = [];
    this.gameOver = this.props.onGameOver || function() {};
  }

  shouldComponentUpdate() {
    // For now let's just never re-render;
    return false;
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
    const memory = await (await fetch('/gameData.json')).json();
    memory.romData = romData;
    this.gameMemoryData = memory;
    this.nes = new NES({
      onFrame: this.screen.setBuffer,
      onStatusUpdate: console.log
    });
    this.layout();

    window.addEventListener('resize', this.layout);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.layout);
  }

  layout() {
    this.screen.stretchToContainer();
  }

  restart() {
    this.reset();
    this.renderLoop = window.requestAnimationFrame(this.gameLoop);
  }

  setButtons(inputString) {
    this.buttonInstructions = parseInput(inputString);
  }

  setSpeed(speed = DEFAULT_SPEED) {
    this.speed = speed;
  }

  gameLoop() {
    // Skip frames depending on the speed (for speed runs)
    for (let x = 0; x < this.speed; x++) {
      if (this.buttonInstructions.length > 0) {
        const { button, mode } = this.buttonInstructions[0];
        if (mode === 'release') {
          this.nes.buttonUp(1, button);
        } else if (mode === 'press') {
          this.nes.buttonDown(1, button);
        }
        this.buttonInstructions = this.buttonInstructions.slice(1);
      }
      this.nes.frame();
      if (!this.playerStillActive()) {
        this.finishGame();
        return;
      }
    }

    this.screen.writeBuffer();
    if (this.buttonInstructions.length === 0) {
      this.finishGame();
    } else {
      this.renderLoop = window.requestAnimationFrame(this.gameLoop);
    }
  }

  finishGame() {
    const finalTime = getTime(this.nes);
    const score = getScore(this.nes);
    const coins = getCoins(this.nes);
    this.gameOver({ score, coins, finalTime });
    this.reset();
  }

  reset() {
    if (this.renderLoop) {
      window.cancelAnimationFrame(this.renderLoop);
      this.renderLoop = undefined;
    }
    this.nes.fromJSON(cloneDeep(this.gameMemoryData));
  }

  playerStillActive() {
    return getCurrentLives(this.nes) >= 2;
  }

  skipFrames(skipCount) {
    for (let i = 0; i < skipCount; i++) {
      this.nes.frame();
    }
  }

  render() {
    return <Screen ref={screen => (this.screen = screen)} />;
  }
}

export default Game;
