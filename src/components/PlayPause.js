import React from 'react';
import PropTypes from 'prop-types';

const PlayPause = ({ onClick, playing }) => {
  const buttonText = playing ? 'Play' : 'Pause';

  return (
    <button
      type="button"
      onClick={onClick}
    >
      {buttonText}
    </button>
  );
};

PlayPause.propTypes = {
  onClick: PropTypes.func.isRequired,
  playing: PropTypes.bool.isRequired,
};

export default PlayPause;
