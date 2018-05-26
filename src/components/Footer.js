import React from 'react';
import styled from 'styled-components';

import { Text, Link } from './common';

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
    </FooterWrapper>
  );
};

export default Footer;
