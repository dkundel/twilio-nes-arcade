import { Controller } from 'jsnes';
import { unemojify } from 'node-emoji';
import flatten from 'lodash.flatten';

export const WAIT = Infinity;
export const DURATION_OF_BUTTON_IN_FRAMES = 20;

export const EMOJI_BUTTON_MAP = {
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

export const AVAILABLE_BUTTONS = [
  '⬆️',
  '➡️',
  '⬅️',
  '⬇️',
  '🚀',
  '✊',
  '✋',
  '👉',
  '🕐'
];

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

function expandString(input) {
  let multiplierCounts = [];
  const multiplierRegEx = /\d+/g;
  const redactedInput = input.replace(multiplierRegEx, match => {
    multiplierCounts.push(parseInt(match, 10));
    return '?';
  });
  const inputArray = [...redactedInput];
  return flatten(
    inputArray.map((val, idx) => {
      if (val !== '?') {
        return val;
      }
      const count = multiplierCounts[0];
      multiplierCounts = multiplierCounts.slice(1);
      const emoji = inputArray[idx + 1];
      return new Array(count - 1).fill(emoji);
    })
  );
}

export function parseInput(inputString) {
  const emojiInput = expandString(inputString);
  const buttons = emojiInput.map(convertEmojisToButtons).filter(x => x !== -1);
  return convertToButtonCommandsPerFrame(buttons);
}
