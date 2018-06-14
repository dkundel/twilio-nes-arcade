import { Controller } from 'jsnes';
import flatten from 'lodash.flatten';
import { unemojify } from 'node-emoji';

export const WAIT = Infinity;
export const PRESS = 99;
export const RELEASE = 100;
export const DURATION_OF_BUTTON_IN_FRAMES = 20;
export const PADDING_FRAMES = 200;

export const RAW_MAP = {
  u: 'Up',
  d: 'Down',
  l: 'Left',
  r: 'Right',
  a: 'A',
  b: 'B',
  s: 'START',
  x: 'SELECT',
  w: 'Wait',
  '!': 'Hold',
  '?': 'Release',
  ':arrow_up:': 'Up',
  ':arrow_down:': 'Down',
  ':arrow_left:': 'Left',
  ':arrow_right:': 'Right',
  ':rocket:': 'A',
  ':fist:': 'B',
  ':raised_hand:': 'START',
  ':point_right:': 'SELECT',
  ':clock1:': 'Wait'
};

export const EMOJI_BUTTON_MAP = Object.keys(RAW_MAP).reduce((map, key) => {
  const mappedValue = RAW_MAP[key];
  if (mappedValue === 'Wait') {
    map[key] = WAIT;
  } else if (mappedValue === 'Hold') {
    map[key] = PRESS;
  } else if (mappedValue === 'Release') {
    map[key] = RELEASE;
  } else {
    map[key] = Controller['BUTTON_' + mappedValue.toUpperCase()];
  }
  return map;
}, {});

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
  let shouldPress = false;
  let shouldRelease = false;
  for (const button of buttons) {
    if (button === WAIT) {
      instructions.push({ mode: 'none' });
    } else if (button === PRESS) {
      shouldPress = true;
      continue;
    } else if (button === RELEASE) {
      shouldRelease = true;
      continue;
    } else {
      if (shouldPress) {
        shouldPress = false;
        instructions.push({ button, mode: 'press' });
        continue;
      } else if (shouldRelease) {
        shouldRelease = false;
        instructions.push({ button, mode: 'release' });
        continue;
      }
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

  // add padding in the end to wait for jump to finish
  for (let i = 0; i < PADDING_FRAMES; i++) {
    instructions.push({ mode: 'none' });
  }
  return instructions;
}

function expandString(input) {
  let multiplierCounts = [];
  const multiplierRegEx = /\d+/g;
  const redactedInput = input.replace(multiplierRegEx, match => {
    multiplierCounts.push(parseInt(match, 10));
    return '*';
  });
  const inputArray = [...redactedInput];
  return flatten(
    inputArray.map((val, idx) => {
      if (val !== '*') {
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
