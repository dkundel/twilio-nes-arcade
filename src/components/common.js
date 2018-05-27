import styled from 'styled-components';

const PixelFont = param => `font-family: 'Press Start 2P', sans-serif;`;
const TextFont = param => `font-family: 'Share Tech Mono', monospace;`;
const InterlacedBackground = param =>
  `background-image: url('/scanlines.svg');`;

export const Title = styled.h1`
  ${PixelFont};
  text-shadow: 5px 5px 0px #000;
`;

export const Button = styled.button`
  background-color: rgba(255, 255, 255, 0.2) /*rgba(51, 52, 72, 1)*/;
  color: #fff;
  ${PixelFont};
  border: 2px solid #fff;
  font-size: 1em;
  padding: 20px;
  cursor: pointer;
  text-shadow: 2px 2px 0px #777;

  &:hover,
  &:focus {
    background-color: #f22f46;
    ${InterlacedBackground};
    text-shadow: 2px 2px 0px #000;
  }
`;

export const ActionButton = styled(Button)`
  background-color: #29c467;
  ${InterlacedBackground};

  &:hover,
  &:focus {
    background-color: #36d576;
  }
`;

export const Text = styled.p`
  ${TextFont};
`;

export const Link = styled.a`
  color: inherit;

  &:hover,
  &:focus {
    color: #f22f46;
    text-decoration: underline;
  }
`;
