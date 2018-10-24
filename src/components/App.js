import React from 'react';
import Header from './Header';
import Chart from './Chart';
import PlayPause from './PlayPause';
import DataSlider from './DataSlider';
import { FlexLayout } from '../styles/components/common';
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
    this.onYearIndexSliderChange = this.onYearIndexSliderChange.bind(this);
  }

  onIncrementYearIndex() {
    const { yearIndex, data: { length } } = this.state;
    this.setState({
      yearIndex: (yearIndex + 1) % length,
    });
  }

  onPlayPauseClick() {
    const { playing } = this.state;
    this.setState({ playing: ! playing });

    if (! playing) {
      this.incrementInterval = setInterval(
        this.onIncrementYearIndex.bind(this),
        200
      );
    } else {
      clearInterval(this.incrementInterval);
    }
  }

  onYearIndexSliderChange(value) {
    this.setState({
      yearIndex: value,
      playing: false,
    });
    clearInterval(this.incrementInterval);
  }

  render() {
    const { playing, data, yearIndex } = this.state;
    return (
      <div>
        <Header title="Gapminder Clone" />
        {/* TODO: when play/pause changes state, this updates - not desired */}
        <Chart data={data} yearIndex={yearIndex} />
        <FlexLayout>
          <PlayPause playing={playing} onClick={this.onPlayPauseClick} />
          <DataSlider
            value={yearIndex}
            text={data[yearIndex].year}
            maxValue={data.length - 1}
            onChange={this.onYearIndexSliderChange}
          />
        </FlexLayout>
      </div>
    );
  }
}
