import * as d3 from 'd3';

const xTicks = [250, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000];

// TODO: constants
const margin = {
  top: 30,
  right: 5,
  bottom: 50,
  left: 65,
};

// TODO: constants
const colorSet = [
  '#EE5D5E',
  '#FFC900',
  '#24B9C4',
  '#8BC66F',
];

// TODO: to utils
function xGridlines(x) {
  return d3.axisBottom(x)
    .tickValues(xTicks);
}
function yGridlines(y) {
  return d3.axisLeft(y)
    .ticks(8);
}

function xTickFormat(value, index, ticks, precision = 0) {
  return 10000 < value
    ? d3.formatPrefix(`,.${precision}`, 1e3)(value) : d3.format(',')(value);
}

export default class Gapminder {
  constructor(el, data) {
    this.el = el;

    const continents = data[0].countries
      .map((country) => country.continent)
      .filter((item, idx, arr) => arr.indexOf(item) === idx);

    // const yExtent = d3.extent(
    //   data.reduce(
    //     (acc, { countries }) => acc.concat(
    //       // eslint-disable-next-line camelcase
    //       countries.map(({ life_exp }) => life_exp)
    //     ), []
    //   ).filter((item) => item)
    // );
    // todo - consider permanently using 0-90
    const yExtent = [0, 90];

    const xExtent = d3.extent(
      data.reduce(
        (acc, { countries }) => acc.concat(
          countries.map(({ income }) => income)
        ), []
      ).filter((item) => item)
    );

    const areaExtent = d3.extent(
      data.reduce(
        (acc, { countries }) => acc.concat(
          countries.map(({ population }) => Math.sqrt(population) / Math.PI)
        ), []
      ).filter((item) => item)
    );

    // this.init = this.init.bind(this);
    this.create = this.create.bind(this);
    this.render = this.render.bind(this);
    this.setData = this.setData.bind(this);

    this.continents = continents;
    this.areaExtent = areaExtent;
    this.xExtent = xExtent;
    this.yExtent = yExtent;
    this.filteredContinents = [];
    this.data = data;
    this.innerHeight = 0;
    this.innerWidth = 0;
  }

  create(dimensions) {
    const {
      el,
      xExtent,
      yExtent,
      areaExtent,
      continents,
    } = this;

    let { filteredContinents } = this;
    const svg = d3.select(el);

    const defs = svg.append('defs');

    const blurFilter = defs.append('filter')
      .attr('id', 'boxShadow');
    blurFilter.append('feGaussianBlur')
      .attr('stdDeviation', 3)
      .attr('result', 'coloredBlur');
    const feMerge = blurFilter.append('feMerge');
    feMerge.append('feMergeNode')
      .attr('in', 'coloredBlur');
    feMerge.append('feMergeNode')
      .attr('in', 'SourceGraphic');

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
      .attr('class', 'gm-axis-units x')
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

    const areaScale = d3.scaleLinear()
      .domain(areaExtent);

    const continentsScale = d3.scaleOrdinal(
      colorSet
    ).domain(this.continents);

    const cCountries = gRoot
      .selectAll('circle');

    const yearText = gRoot.append('text')
      .attr('class', 'gm-year-text')
      .attr('text-anchor', 'middle');

    // Hover Elements
    const gHoverLines = gRoot.append('g')
      .attr('class', 'gm-hover-group');

    const gHoverText = gHoverLines.append('g')
      .attr('class', 'gm-hover-text')
      .style('opacity', 0.9);

    gHoverText.append('rect')
      .attr('class', 'gm-hover-mask-y')
      .attr('x', - 35)
      .style('fill', 'white')
      .attr('width', 35);
    gHoverText.append('rect')
      .attr('class', 'gm-hover-mask-x')
      .attr('x', 0)
      .attr('height', 25)
      .style('fill', 'white');

    gHoverText.append('text')
      .attr('class', 'gm-hover-text-y')
      .attr('text-anchor', 'end')
      .attr('x', - 5)
      .attr('y', 30)
      .text('00.0')
      .attr('fill', 'black');
    gHoverText.append('text')
      .attr('class', 'gm-hover-text-x')
      .attr('text-anchor', 'middle')
      .attr('x', 0)
      .attr('y', 30)
      .text('99.9')
      .attr('fill', 'black');

    const yHoverLine = gHoverLines.append('line')
      .style('stroke-dasharray', '3,3')
      .attr('class', 'gm-hover-line-y');

    const xHoverLine = gHoverLines.append('line')
      .style('stroke-dasharray', '3,3')
      .attr('class', 'gm-hover-line-x');

    const gCircles = gRoot.append('g')
      .attr('class', 'gm-circle-group');

    const gTooltip = gRoot.append('g')
      .attr('transform', 'translate(100,100)')
      .style('filter', 'url(#boxShadow)')
      .style('display', 'none');

    const tooltipRect = gTooltip.append('rect')
      .attr('rx', 10)
      .attr('class', 'gm-tooltip-rect');
    const tooltipText = gTooltip.append('text');

    const gLegend = gRoot.append('g');
    const gLegendRows = gLegend.selectAll('g')
      .data(continents)
      .enter()
      .append('g')
      .attr('class', 'gm-legend-row')
      .attr('transform', (dataItem, index) => `translate(0, ${index * 24})`)
      .on('click', (dataItem, index, nodes) => {
        const rect = d3.select(nodes[index]).select('rect');
        if (filteredContinents.includes(dataItem)) {
          filteredContinents.splice(filteredContinents.indexOf(dataItem), 1);
          rect.attr('fill', continentsScale(dataItem));
        } else {
          filteredContinents.splice(0, 0, dataItem);
          rect.attr('fill', 'white');
        }
        if (filteredContinents.length === continents.length) {
          filteredContinents = [];
          this.resetLegend();
        }

        this.filteredContinents = filteredContinents;
        this.setData();
      });
    gLegendRows.append('rect')
      .attr('height', 16)
      .attr('width', 16)
      .attr('fill', (dataItem) => continentsScale(dataItem));
    gLegendRows.append('text')
      .text((dataItem) => dataItem)
      .attr('text-anchor', 'end')
      .attr('class', 'continent')
      .attr('x', - 6)
      .attr('y', 13);

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
    this.gHoverLines = gHoverLines;
    this.xHoverLine = xHoverLine;
    this.yHoverLine = yHoverLine;
    this.gHoverText = gHoverText;
    this.gTooltip = gTooltip;
    this.tooltipRect = tooltipRect;
    this.tooltipText = tooltipText;
    this.gLegend = gLegend;
    this.gLegendRows = gLegendRows;
    this.sizeTooltip();
    this.render(dimensions);
  }

  resetLegend() {
    const { gLegendRows, continentsScale } = this;
    gLegendRows
      .selectAll('rect')
      .attr('fill', (dataItem) => continentsScale(dataItem));
  }

  positionTooltip(element) {
    const radius = + element.attr('r');
    const cx = + element.attr('cx');
    const cy = + element.attr('cy');
    const { gTooltip } = this;
    const { width, height } = gTooltip.node().getBBox();
    const toBottom = 0 > (cy - radius - height);
    const toRight = 0 > (cx - radius - width);
    let x;
    let y;
    let theta;
    if (toBottom) {
      theta = (- Math.PI / 4) * (toRight ? 3 : 1); // -45 or -135
      x = cx - (Math.cos(theta) * radius) - width - 8;
      y = cy - (Math.sin(theta) * radius);
    } else {
      theta = (Math.PI / 4) * (toRight ? 3 : 1); // 45
      x = cx - (Math.cos(theta) * radius) - width - 8;
      y = cy - (Math.sin(theta) * radius) - height;
    }

    gTooltip.attr('transform', `translate(${x}, ${y})`);
  }

  sizeTooltip() {
    const padding = 10;
    const { tooltipRect, tooltipText } = this;
    const bbox = tooltipText.node().getBBox();
    tooltipRect
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', bbox.width + (2 * padding))
      .attr('height', bbox.height + (2 * padding));
    tooltipText
      .attr('x', padding)
      .attr('y', bbox.height + padding / 2);
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
      gHoverLines,
      gHoverText,
      xHoverLine,
      yHoverLine,
      gLegend,
    } = this;
    const {
      top,
      bottom,
      left,
      right,
    } = margin;
    const innerHeight = height - top - bottom;
    const innerWidth = width - left - right;

    gHoverLines.style('display', 'none');

    svg.attr('width', width)
      .attr('height', height);

    gRoot.attr('transform', `translate(${left}, ${right})`);

    gXAxis.attr('transform', `translate(0, ${innerHeight})`);

    // Scales
    yScale.range([innerHeight, 0]).domain();
    xScale.range([0, innerWidth]);
    // areaScale.range([1, 181]);
    areaScale.range([width * 0.0025, width * 0.05]);

    const yAxis = d3.axisLeft(yScale);
    const xAxis = d3.axisBottom(xScale)
      .tickValues(xTicks)
      .tickFormat(xTickFormat);

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

    xHoverLine.attr('y1', 0).attr('y2', innerHeight);
    yHoverLine.attr('x1', 0).attr('x2', innerWidth);

    gHoverText.select('.gm-hover-mask-y')
      .attr('height', innerHeight + 21)
      .attr('y', - 10);
    gHoverText.select('.gm-hover-mask-x')
      .attr('width', innerWidth)
      .attr('y', innerHeight + 1);
    gHoverText.select('.gm-hover-text-x')
      .attr('y', innerHeight + 23);

    const yearTextScale = width / 570;
    yearText
      .attr('x', (innerWidth / 2) / yearTextScale)
      .attr('y', (innerHeight / 2) / yearTextScale + 40)
      .attr('transform', `scale(${yearTextScale})`);

    // Add Legend
    gLegend
      .attr(
        'transform',
        `translate(${innerWidth - 50}, ${innerHeight - 150})`
      );

    this.innerHeight = innerHeight;
    this.innerWidth = innerWidth;
  }

  setData(data = this.data) {
    const {
      gCircles,
      xScale,
      yScale,
      areaScale,
      continentsScale,
      yearText,
      gHoverText,
      gHoverLines,
      xHoverLine,
      yHoverLine,
      innerHeight,
      tooltipText,
      gTooltip,
      filteredContinents,
    } = this;

    this.data = data;

    yearText.text(data.year);

    // areaScale.domain(
    //   d3.extent(
    //     data.countries.map(
    //       (country) => Math.sqrt(country.population) / Math.PI
    //     )
    //   )
    // );

    const cCountries = gCircles
      .selectAll('circle')
      .data(
        data.countries
          .filter((country) => country.income && country.life_exp)
          .filter((country) => ! filteredContinents.includes(country.continent))
          .sort(
            ({ population: pA }, { population: pB }) => (pA > pB ? - 1 : 1)
          ),
        (item) => item.country
      );

    cCountries
      .exit()
      .transition()
      .attr('r', 0)
      .remove();

    function countryOver(dataItem, index, circles) {
      const element = d3.select(circles[index]);
      gHoverLines.style('display', 'block');
      // eslint-disable-next-line camelcase
      const { income, life_exp, country } = dataItem;
      const x = xScale(income);
      const y = yScale(life_exp);
      const translateX = `translate(${x}, ${y})`;
      const translateY = `translate(0, ${y})`;

      gTooltip.style('display', 'block');
      tooltipText.text(country);
      this.sizeTooltip();
      this.positionTooltip(element);

      xHoverLine.attr('transform', translateX)
        .attr('y2', innerHeight - y);
      yHoverLine.attr('transform', translateY)
        .attr('x2', x);
      gHoverText.select('.gm-hover-text-x')
        .attr('x', x)
        .text(xTickFormat(income, null, null, 1));
      gHoverText.select('.gm-hover-text-y')
        .attr('y', y + 7)
        .text(d3.format(',.1f')(life_exp));
      d3.selectAll(circles).transition().style('opacity', '0.1');
      element.transition().style('opacity', '1');
    }

    function countryOut(itemData, index, circles) {
      gHoverLines.style('display', 'none');
      d3.selectAll(circles).transition().style('opacity', '1');
      gTooltip.style('display', 'none');
    }

    cCountries
      .enter()
      .append('circle')
      .attr('class', 'gm-data-point')
      .attr('fill', (item) => continentsScale(item.continent))
      .merge(cCountries)
      .on('mouseover', countryOver.bind(this))
      .on('mouseout', countryOut)
      .transition()
      .attr('r', (item) => areaScale(Math.sqrt(item.population) / Math.PI))
      .attr('cx', (item) => xScale(item.income))
      .attr('cy', (item) => yScale(item.life_exp));
  }
}
