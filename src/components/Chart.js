import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Responsive from './Responsive';
import Gapminder from './Gapminder';

const height = 700;
const MarginedChart = styled.div`
  margin-top: 2em;
`;

class Chart extends React.Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    yearIndex: PropTypes.number.isRequired,
    // TODO: set up shape
    data: PropTypes.shape({}).isRequired,
  };

  componentDidMount() {
    const { width, data, yearIndex } = this.props;
    const dimensions = { height, width };
    this.gapminder = new Gapminder(this.rootNode, data);
    this.gapminder.create(dimensions, data);
    this.gapminder.setData(data[yearIndex]);
  }

  componentDidUpdate() {
    const { width, data, yearIndex } = this.props;
    this.gapminder.render({ width, height });
    this.gapminder.setData(data[yearIndex]);
  }

  setRef(componentNode) {
    this.rootNode = componentNode;
  }

  render() {
    return (
      <MarginedChart>
        <svg ref={this.setRef.bind(this)} />
      </MarginedChart>
    );
  }
}

export default Responsive(Chart);
