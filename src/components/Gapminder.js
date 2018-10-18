import * as d3 from 'd3';

const xTicks = [250, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000];

// TODO: to utils
function xGridlines(x) {
  return d3.axisBottom(x)
    .tickValues(xTicks);
}
function yGridlines(y) {
  return d3.axisLeft(y)
    .ticks(8);
}

// TODO: constants
const margin = {
  top: 30,
  right: 30,
  bottom: 80,
  left: 90,
};

// TODO: constants
const colorSet = [
  '#EE5D5E',
  '#FFC900',
  '#24B9C4',
  '#8BC66F',
];

export default class Gapminder {
  constructor(el, data) {
    this.el = el;

    const continents = data[0].countries
      .map((country) => country.continent)
      .filter((item, idx, arr) => arr.indexOf(item) === idx);

    const yExtent = d3.extent(
      data.reduce(
        (acc, { countries }) => acc.concat(
          // eslint-disable-next-line camelcase
          countries.map(({ life_exp }) => life_exp)
        ), []
      ).filter((item) => item)
    );

    const xExtent = d3.extent(
      data.reduce(
        (acc, { countries }) => acc.concat(
          countries.map(({ income }) => income)
        ), []
      ).filter((item) => item)
    );

    // this.init = this.init.bind(this);
    this.create = this.create.bind(this);
    this.render = this.render.bind(this);
    this.setData = this.setData.bind(this);

    this.continents = continents;
    this.xExtent = xExtent;
    this.yExtent = yExtent;
    this.data = data;
  }

  create(dimensions) {
    const { el, xExtent, yExtent } = this;
    const svg = d3.select(el);

    const gRoot = svg.append('g');

    // Append Axes
    const gXAxis = gRoot.append('g').attr('class', 'gm-axis');
    const gYAxis = gRoot.append('g').attr('class', 'gm-axis');

    // Axis Labels
    const labelsGroup = gRoot.append('g').attr('class', 'gm-labels');
    const xAxisLabel = labelsGroup.append('text').text('Income')
      .attr('text-anchor', 'middle')
      .attr('class', 'gm-axis-label');
    const xAxisUnits = labelsGroup.append('text')
      .attr('text-anchor', 'end')
      .attr('class', 'gm-axis-units')
      .text('per person (GDP/capita, PPP$ inflation-adjusted)');

    const yAxisLabel = labelsGroup.append('text').text('Life Expectancy')
      .attr('text-anchor', 'end')
      .attr('text-anchor', 'middle')
      .attr('class', 'gm-axis-label');
    const yAxisUnits = labelsGroup.append('text')
      .attr('class', 'gm-axis-units')
      .text('years');

    const xGrid = gRoot.append('g')
      .attr('class', 'gm-grid')
      .style('stroke-dasharray', ('3,3'));

    const yGrid = gRoot.append('g')
      .attr('class', 'gm-grid')
      .style('stroke-dasharray', ('3,3'));

    // Scales
    const yScale = d3.scaleLinear()
      .domain(yExtent);

    const xScale = d3.scaleLog()
      .domain(xExtent);

    const areaScale = d3.scaleLinear();

    const continentsScale = d3.scaleOrdinal(
      colorSet
    ).domain(this.continents);

    const cCountries = gRoot
      .selectAll('circle');

    const yearText = gRoot.append('text')
      .attr('class', 'gm-year-text')
      .attr('text-anchor', 'middle');

    const gCircles = gRoot.append('g')
      .attr('class', 'gm-circle-group');

    this.svg = svg;
    this.gRoot = gRoot;
    this.gCircles = gCircles;
    this.gXAxis = gXAxis;
    this.gYAxis = gYAxis;
    this.xScale = xScale;
    this.yScale = yScale;
    this.cCountries = cCountries;
    this.areaScale = areaScale;
    this.continentsScale = continentsScale;
    this.yearText = yearText;
    this.xAxisLabel = xAxisLabel;
    this.xAxisUnits = xAxisUnits;
    this.yAxisLabel = yAxisLabel;
    this.yAxisUnits = yAxisUnits;
    this.xGrid = xGrid;
    this.yGrid = yGrid;
    this.render(dimensions);
  }

  render({ width, height }) {
    const {
      svg,
      gRoot,
      gXAxis,
      gYAxis,
      xScale,
      yScale,
      areaScale,
      yearText,
      xAxisLabel,
      xAxisUnits,
      yAxisLabel,
      yAxisUnits,
      xGrid,
      yGrid,
    } = this;
    const {
      top,
      bottom,
      left,
      right,
    } = margin;
    const innerHeight = height - top - bottom;
    const innerWidth = width - left - right;

    svg.attr('width', width)
      .attr('height', height);

    gRoot.attr('transform', `translate(${left}, ${right})`);

    gXAxis.attr('transform', `translate(0, ${innerHeight})`);

    // Scales
    yScale.range([innerHeight, 0]).domain();
    xScale.range([0, innerWidth]);
    areaScale.range([width * 0.0025, width * 0.05]);

    const yAxis = d3.axisLeft(yScale);
    const xAxis = d3.axisBottom(xScale)
      .tickValues(xTicks)
      .tickFormat((tick) => (
        10000 < tick ? d3.formatPrefix(',.0', 1e3)(tick) : d3.format(',')(tick)
      ));

    // Axis Labels
    xAxisLabel.attr('x', innerWidth / 2)
      .attr('y', innerHeight + 50);
    yAxisLabel.attr('x', - (innerHeight / 2))
      .attr('y', - 45)
      .attr('transform', 'rotate(-90)');
    xAxisUnits
      .attr('x', innerWidth - 5)
      .attr('y', innerHeight - 5);
    yAxisUnits.attr('x', - 40)
      .attr('y', 15)
      .attr('transform', 'rotate(-90)');

    gXAxis.call(xAxis);
    gYAxis.call(yAxis);

    // Grid
    xGrid
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xGridlines(xScale).tickSize(- innerHeight).tickFormat(''));
    yGrid
      .call(yGridlines(yScale).tickSize(- innerWidth).tickFormat(''));

    const yearTextScale = width / 570;
    yearText
      .attr('x', (innerWidth / 2) / yearTextScale)
      .attr('y', (innerHeight / 2) / yearTextScale + 40)
      .attr('transform', `scale(${yearTextScale})`);
  }

  setData(data) {
    const {
      gCircles,
      xScale,
      yScale,
      areaScale,
      continentsScale,
      yearText,
    } = this;

    yearText.text(data.year);

    areaScale.domain(
      d3.extent(
        data.countries.map(
          (country) => Math.sqrt(country.population) / Math.PI
        )
      )
    );

    const cCountries = gCircles
      .selectAll('circle')
      .data(
        data.countries.filter((country) => country.income && country.life_exp),
        (item) => item.country
      );

    cCountries
      .exit()
      .transition()
      .attr('r', 0)
      .remove();

    cCountries
      .enter()
      .append('circle')
      .attr('class', 'gm-data-point')
      .attr('fill', (item) => continentsScale(item.continent))
    // .on('mouseover', tooltip.show)
    // .on('mouseout', tooltip.hide)
      .merge(cCountries)
      .transition()
      .attr('r', (item) => areaScale(Math.sqrt(item.population) / Math.PI))
      .attr('cx', (item) => xScale(item.income))
      .attr('cy', (item) => yScale(item.life_exp));
  }
}
