import React from 'react';
import styled from 'styled-components';
import { Link, Text } from './common';

const FooterWrapper = styled.footer`
  text-align: center;
`;

const Footer = () => {
  return (
    <FooterWrapper>
      <Text>
        Created by <Link href="https://github.com/dkundel">Dominik Kundel</Link>.
        Code available on{' '}
        <Link href="https://github.com/dkundel/twilio-nes-arcade">GitHub</Link>.
      </Text>
      <Text>
        Your phone number will only be used as game input and all messages &
        phone numbers will be redacted after the event.
      </Text>
    </FooterWrapper>
  );
};

export default Footer;
