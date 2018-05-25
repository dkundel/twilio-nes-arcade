import React, { Component } from 'react';
import { NES } from 'jsnes';
import cloneDeep from 'lodash.clonedeep';

import Screen from './Screen';
import {
  getCurrentLives,
  getTime,
  getScore,
  getCoins
} from '../utils/marioMemory';
import { parseInput } from '../utils/input';

const GAME_URL =
  'https://d3cto2l652k3y0.cloudfront.net/Super%20Mario%20Bros.%20(JU)%20(PRG0)%20[!].nes';
const DEFAULT_SPEED = 5;

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      speed: DEFAULT_SPEED
    };
    this.gameLoop = this.gameLoop.bind(this);
    this.buttonInstructions = [];
    this.gameOver = this.props.gameOver || function() {};
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
    this.screen.stretchToContainer();
  }

  restart() {
    this.reset();
    this.renderLoop = window.requestAnimationFrame(this.gameLoop);
  }

  setButtons(inputString) {
    this.buttonInstructions = parseInput(inputString);
  }

  gameLoop() {
    // Skip frames depending on the speed (for speed runs)
    for (let x = 0; x < this.state.speed; x++) {
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
        const finalTime = getTime(this.nes);
        const score = getScore(this.nes);
        const coins = getCoins(this.nes);
        this.gameOver({ score, coins, finalTime });
        this.reset();
        return;
      }
    }

    this.screen.writeBuffer();
    this.renderLoop = window.requestAnimationFrame(this.gameLoop);
  }

  reset() {
    if (this.renderLoop) {
      window.cancelAnimationFrame(this.renderLoop);
      this.renderLoop = undefined;
    }
    this.nes.fromJSON(cloneDeep(this.gameMemoryData));
    window.nes = this.nes.cpu.mem;
  }

  playerStillActive() {
    return getCurrentLives(this.nes) >= 2;
  }

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
    return <Screen ref={screen => (this.screen = screen)} />;
  }
}

export default Game;
