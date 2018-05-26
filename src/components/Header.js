import React from 'react';
import styled from 'styled-components';

import { Title } from './common';
import twilioLogo from '../assets/twilio-pixel-logo.png';

const HeaderContainer = styled.header`
  text-align: center;
  padding: 20px;
`;
const Twilio = styled.img`
  height: 60px;
`;
const MaxTitle = styled(Title)`
  margin: 0;
  margin-top: 10px;
  text-transform: uppercase;
  font-size: 50px;
`;

const Header = () => {
  return (
    <HeaderContainer>
      <Twilio src={twilioLogo} alt="Twilio" />
      <MaxTitle>Arcade</MaxTitle>
    </HeaderContainer>
  );
};

export default Header;
