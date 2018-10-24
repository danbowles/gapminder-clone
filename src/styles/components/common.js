import styled from 'styled-components';
import { media } from '../../config/breakpoints';

const layoutCommon = `
  max-width: 85%;
  margin: 0 auto;

  ${media.smMax} {
    max-width: 100%;
  }
`;

export const Layout = styled.div`
  ${layoutCommon}
`;

export const FlexLayout = styled.div`
  ${layoutCommon}
  display: flex;
`;

