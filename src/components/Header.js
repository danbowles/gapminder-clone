import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Layout from '../styles/components/common';
import { media } from '../config/breakpoints';

const Header = ({ title }) => {
  const HeaderContainer = styled.div`
    background: var(--gradient-header);
    padding: 1.5em 1em;

    ${media.smMax} {
      padding: 1em;
    }
  `;
  const Title = styled.h1`
    color: var(--color-white);
    font-weight: 100;
    margin: 0;

    ${media.smMax} {
      font-size: 1.5rem;
    }
  `;
  return (
    <HeaderContainer>
      <Layout>
        <Title>{title}</Title>
      </Layout>
    </HeaderContainer>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Header;
