import React from 'react';
import Header from './Header';
import Chart from './Chart';
import PlayPause from './PlayPause';
import appData from '../data/data';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playing: false,
      data: appData,
      yearIndex: appData.length - 1,
    };

    // Bind events to `this`;
    this.onPlayPauseClick = this.onPlayPauseClick.bind(this);
  }

  onPlayPauseClick() {
    const { playing } = this.state;
    this.setState({ playing: ! playing });
  }

  render() {
    const { playing, data, yearIndex } = this.state;
    return (
      <div>
        <Header title="Gapminder Clone" />
        {/* TODO: when play/pause changes state, this updates - not desired */}
        <Chart data={data} yearIndex={yearIndex} />
        <PlayPause playing={playing} onClick={this.onPlayPauseClick} />
      </div>
    );
  }
}
