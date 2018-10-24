import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import * as d3 from 'd3';

const ScreenReaderText = styled.span`
  border: 0;
  clip: rect(0, 0, 0, 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
`;
const PlayPauseButton = styled.button`
  background-color: transparent;
  border: 3px solid var(--color-lavender-gray);
  border-radius: 40px;
  display: block;
  height: 80px;
  margin: 1em;
  outline: none;
  overflow: visible;
  padding: 2px;
  text-decoration: none;
  width: 80px;

  & svg {
    fill: var(--color-raven);
  }
`;

class PlayPause extends React.Component {
  constructor(props) {
    super(props);

    this.setIcon = this.setIcon.bind(this);
    this.svgRef = React.createRef();
  }

  componentDidMount() {
    this.setIcon();
  }

  componentDidUpdate() {
    this.setIcon();
  }

  setIcon() {
    const { playing } = this.props;
    const svgRef = d3.select(this.svgRef.current);
    const iconData = svgRef
      .select(`#${playing ? 'pause' : 'play'}-icon`)
      .attr('d');
    svgRef.select('.icon').attr('d', iconData);
  }

  render() {
    const { playing, onClick } = this.props;
    return (
      <PlayPauseButton
        type="button"
        onClick={onClick}
      >
        <svg
          width="70"
          height="70"
          ref={this.svgRef}
        >
          <defs>
            <path
              id="pause-icon"
              // eslint-disable-next-line max-len
              d="M35,70 C15.6700338,70 0,54.3299662 0,35 C0,15.6700338 15.6700338,0 35,0 C54.3299662,0 70,15.6700338 70,35 C70,54.3299662 54.3299662,70 35,70 Z M23,21 C21.8954305,21 21,21.8357351 21,22.8666667 L21,47.1333333 C21,48.1642649 21.8954305,49 23,49 L31,49 C32.1045695,49 33,48.1642649 33,47.1333333 L33,22.8666667 C33,21.8357351 32.1045695,21 31,21 L23,21 Z M39,21 C37.8954305,21 37,21.8357351 37,22.8666667 L37,47.1333333 C37,48.1642649 37.8954305,49 39,49 L47,49 C48.1045695,49 49,48.1642649 49,47.1333333 L49,22.8666667 C49,21.8357351 48.1045695,21 47,21 L39,21 Z"
              // d="M11,10 L17,10 17,26 11,26 M20,10 L26,10 26,26 20,26"
            />
            <path
              id="play-icon"
              // eslint-disable-next-line max-len
              d="M35,70 C15.6700338,70 0,54.3299662 0,35 C0,15.6700338 15.6700338,0 35,0 C54.3299662,0 70,15.6700338 70,35 C70,54.3299662 54.3299662,70 35,70 Z M49.8750376,36.8192836 C50.2687246,36.6224401 50.5879473,36.3032174 50.7847908,35.9095304 C51.2872336,34.9046448 50.8799232,33.6827136 49.8750376,33.1802708 L25.9440232,21.2147636 C25.6615538,21.0735289 25.3500805,21 25.03427,21 C23.9107737,21 23,21.9107737 23,23.03427 L23,46.9652844 C23,47.2810948 23.0735289,47.5925681 23.2147636,47.8750376 C23.7172064,48.8799232 24.9391376,49.2872336 25.9440232,48.7847908 L49.8750376,36.8192836 Z"
              // d="M11,10 L18,13.74 18,22.28 11,26 M18,13.74 L26,18 26,18 18,22.28"
            />
          </defs>
          <path className="icon" />
        </svg>
        <ScreenReaderText>
          {playing ? 'Pause' : 'Play'}
        </ScreenReaderText>
      </PlayPauseButton>
    );
  }
}

PlayPause.propTypes = {
  onClick: PropTypes.func.isRequired,
  playing: PropTypes.bool.isRequired,
};

export default PlayPause;
