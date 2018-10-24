import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Layout } from '../styles/components/common';
import { media } from '../config/breakpoints';

const Header = ({ title }) => {
  const GradientWrap = styled.div`
    background: var(--gradient-header-2);
    box-shadow: 0 1px 8px rgba(0, 0, 0, 0.21);
    padding-bottom: 5px;
  `;
  const HeaderContainer = styled.div`
    background: white;
    padding: 1.5em 1em;

    ${media.smMax} {
      padding: 1em;
    }
  `;
  const Title = styled.h1`
    /* color: var(--color-white); */
    color: var(--color-raven);
    font-weight: 100;
    margin: 0;

    ${media.smMax} {
      font-size: 1.5rem;
    }
  `;
  return (
    <GradientWrap>
      <HeaderContainer>
        <Layout>
          <Title>{title}</Title>
        </Layout>
      </HeaderContainer>
    </GradientWrap>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Header;
