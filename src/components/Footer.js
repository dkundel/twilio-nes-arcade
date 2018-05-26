import React from 'react';
import styled from 'styled-components';

const FooterWrapper = styled.footer`
  padding: 20px;
  text-align: center;
`;

const Footer = () => {
  return (
    <FooterWrapper>
      <p>
        Created by <a href="https://github.com/dkundel">Dominik Kundel</a>
      </p>
    </FooterWrapper>
  );
};

export default Footer;
