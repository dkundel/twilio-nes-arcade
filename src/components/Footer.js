import React from 'react';
import styled from 'styled-components';
import { Link, Text } from './common';

const FooterWrapper = styled.footer`
  padding: 20px;
  text-align: center;
`;

const Footer = () => {
  return (
    <FooterWrapper>
      <Text>
        Created by <Link href="https://github.com/dkundel">Dominik Kundel</Link>
      </Text>
      <Text>
        Code available on{' '}
        <Link href="https://github.com/dkundel/twilio-nes-arcade">GitHub</Link>
      </Text>
    </FooterWrapper>
  );
};

export default Footer;
