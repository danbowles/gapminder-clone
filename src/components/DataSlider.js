import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const RangeContainer = styled.div`
  align-items: center;
  display: flex;
  flex-grow: 1;
  justify-content: center;
  padding-right: 1em;
`;

const StyledRange = styled.input`
  width: 100%;
`;

const YearText = styled.span`
  background: var(--color-raven);
  color: white;
  display: none;
`;

const DataSlider = ({
  value,
  maxValue,
  text,
  onChange,
}) => (
  <RangeContainer>
    <StyledRange
      min="0"
      max={`${maxValue}`}
      type="range"
      value={`${value}`}
      onChange={(e) => onChange(+ e.target.value)}
    />
    <YearText>{text}</YearText>
  </RangeContainer>
);

DataSlider.propTypes = {
  value: PropTypes.number.isRequired,
  maxValue: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,

};

export default DataSlider;
