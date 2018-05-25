import React, { Component } from 'react';
import { NES, Controller } from 'jsnes';
import cloneDeep from 'lodash.clonedeep';
import { unemojify } from 'node-emoji';

import Screen from './Screen';

const GAME_URL =
  'https://d3cto2l652k3y0.cloudfront.net/Super%20Mario%20Bros.%20(JU)%20(PRG0)%20[!].nes';
const DEFAULT_SPEED = 1;
const DURATION_OF_BUTTON_IN_FRAMES = 20;
const EMOJI_BUTTON_MAP = {
  ':arrow_up:': Controller.BUTTON_UP,
  ':arrow_down:': Controller.BUTTON_DOWN,
  ':arrow_left:': Controller.BUTTON_LEFT,
  ':arrow_right:': Controller.BUTTON_RIGHT,
  ':rocket:': Controller.BUTTON_A,
  ':fist:': Controller.BUTTON_B,
  ':raised_hand:': Controller.BUTTON_START,
  ':point_right:': Controller.BUTTON_SELECT
};

function convertEmojisToButtons(text) {
  const emojiString = unemojify(text);
  const button = EMOJI_BUTTON_MAP[emojiString];
  console.log(text, emojiString, button);
  if (typeof button !== 'undefined') {
    return button;
  }
  return -1;
}

function convertToButtonCommandsPerFrame(buttons) {
  const instructions = [];
  for (const button of buttons) {
    instructions.push({ button, mode: 'press' });
    for (let i = 0; i < DURATION_OF_BUTTON_IN_FRAMES - 2; i++) {
      instructions.push({ mode: 'none' });
    }
    instructions.push({ button, mode: 'release' });
  }
  return instructions;
}

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      speed: DEFAULT_SPEED
    };
    this.gameLoop = this.gameLoop.bind(this);
    this.buttonInstructions = [];
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
  }

  reset() {
    this.initGame();
    this.renderLoop = window.requestAnimationFrame(this.gameLoop);
  }

  setButtons(buttons) {
    this.buttons = [...buttons]
      .map(convertEmojisToButtons)
      .filter(x => x !== -1);
    console.log(this.buttons);
    this.buttonInstructions = convertToButtonCommandsPerFrame(this.buttons);
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
    }

    this.screen.writeBuffer();
    this.renderLoop = window.requestAnimationFrame(this.gameLoop);
  }

  initGame() {
    if (this.renderLoop) {
      window.cancelAnimationFrame(this.renderLoop);
      this.renderLoop = undefined;
    }
    this.nes.fromJSON(cloneDeep(this.gameMemoryData));
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
