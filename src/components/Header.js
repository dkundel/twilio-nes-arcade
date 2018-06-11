import React from 'react';
import styled from 'styled-components';
import twilioLogo from '../assets/twilio-pixel-logo.png';
import { Title } from './common';

const HeaderContainer = styled.header`
  text-align: center;
  padding: 20px;
`;
const HeaderLink = styled.a`
  text-decoration: none;
`;
const Twilio = styled.img`
  height: 60px;
`;
const MaxTitle = styled(Title)`
  margin: 0;
  margin-top: 10px;
  text-transform: uppercase;
  font-size: 50px;
  color: #fff;
  text-decoration: none;

  &:hover,
  &:focus {
    color: #ddd;
    text-decoration: underline;
  }
`;

const Header = () => {
  return (
    <HeaderContainer>
      <HeaderLink href="/">
        <Twilio src={twilioLogo} alt="Twilio" />
        <MaxTitle>Arcade</MaxTitle>
      </HeaderLink>
    </HeaderContainer>
  );
};

export default Header;
