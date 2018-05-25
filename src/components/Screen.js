/**
 * This file has been adapted from https://github.com/bfirsh/jsnes-web/blob/master/src/Screen.js
 */
import React, { Component } from 'react';

const SCREEN_WIDTH = 256;
const SCREEN_HEIGHT = 240;

class Screen extends Component {
  render() {
    return (
      <canvas
        className="Screen"
        width={SCREEN_WIDTH}
        height={SCREEN_HEIGHT}
        ref={canvas => {
          this.canvas = canvas;
        }}
      />
    );
  }

  componentDidMount() {
    this.initCanvas();
  }

  componentDidUpdate() {
    this.initCanvas();
  }

  initCanvas() {
    this.context = this.canvas.getContext('2d');
    this.imageData = this.context.getImageData(
      0,
      0,
      SCREEN_WIDTH,
      SCREEN_HEIGHT
    );

    this.context.fillStyle = 'black';
    // set alpha to opaque
    this.context.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    // buffer to write on next animation frame
    this.buf = new ArrayBuffer(this.imageData.data.length);
    // Get the canvas buffer in 8bit and 32bit
    this.buf8 = new Uint8ClampedArray(this.buf);
    this.buf32 = new Uint32Array(this.buf);

    // Set alpha
    for (var i = 0; i < this.buf32.length; ++i) {
      this.buf32[i] = 0xff000000;
    }
  }

  setBuffer = buffer => {
    let i = 0;
    for (let y = 0; y < SCREEN_HEIGHT; ++y) {
      for (let x = 0; x < SCREEN_WIDTH; ++x) {
        i = y * 256 + x;
        // Convert pixel from NES BGR to canvas ABGR
        this.buf32[i] = 0xff000000 | buffer[i]; // Full alpha
      }
    }
  };

  writeBuffer = () => {
    this.imageData.data.set(this.buf8);
    this.context.putImageData(this.imageData, 0, 0);
  };

  stretchToContainer = () => {
    const container = this.canvas.parentNode;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const ratio = SCREEN_HEIGHT / SCREEN_WIDTH;
    this.canvas.style.width = `${containerWidth}px`;
    this.canvas.style.height = `${Math.round(containerWidth * ratio)}px`;
  };
}

export default Screen;
