import React, { Component } from 'react';
import { NES, Controller } from 'jsnes';
import cloneDeep from 'lodash.clonedeep';
import { unemojify } from 'node-emoji';

import Screen from './Screen';
import { getCurrentLives } from '../utils/marioMemory';

const GAME_URL =
  'https://d3cto2l652k3y0.cloudfront.net/Super%20Mario%20Bros.%20(JU)%20(PRG0)%20[!].nes';
const DEFAULT_SPEED = 5;
const DURATION_OF_BUTTON_IN_FRAMES = 20;
const WAIT = Infinity;
const EMOJI_BUTTON_MAP = {
  u: Controller.BUTTON_UP,
  d: Controller.BUTTON_DOWN,
  l: Controller.BUTTON_LEFT,
  r: Controller.BUTTON_RIGHT,
  a: Controller.BUTTON_A,
  b: Controller.BUTTON_B,
  s: Controller.BUTTON_START,
  x: Controller.BUTTON_SELECT,
  w: WAIT,
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
  const emojiString = unemojify(text).toLowerCase();
  if (emojiString.startsWith(':clock')) {
    return WAIT;
  }
  const button = EMOJI_BUTTON_MAP[emojiString];
  if (typeof button !== 'undefined') {
    return button;
  }
  return -1;
}

function convertToButtonCommandsPerFrame(buttons) {
  const instructions = [];
  for (const button of buttons) {
    if (button === WAIT) {
      instructions.push({ mode: 'none' });
    } else {
      instructions.push({ button, mode: 'press' });
    }

    for (let i = 0; i < DURATION_OF_BUTTON_IN_FRAMES - 2; i++) {
      instructions.push({ mode: 'none' });
    }

    if (button === WAIT) {
      instructions.push({ mode: 'none' });
    } else {
      instructions.push({ button, mode: 'release' });
    }
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
  }

  restart() {
    this.reset();
    this.renderLoop = window.requestAnimationFrame(this.gameLoop);
  }

  setButtons(buttons) {
    this.buttons = [...buttons]
      .map(convertEmojisToButtons)
      .filter(x => x !== -1);
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

      if (!this.playerStillActive()) {
        this.gameOver();
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
    this.nes.cpu.mem[0x07e1 & 0x7ff] = 1;
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
