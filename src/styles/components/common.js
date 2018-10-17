import styled from 'styled-components';
import { media } from '../../config/breakpoints';

const Layout = styled.div`
  max-width: 85%;
  margin: 0 auto;

  ${media.smMax} {
    max-width: 100%;
  }
`;

export default Layout;
