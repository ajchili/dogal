import React, {Component} from 'react';
import LoadingIndicator from './LoadingIndicator';
import Overlay from './Overlay';
import PropTypes from 'prop-types';

class LoadingIndicatorOverlay extends Component {
  render() {
    return(
      <Overlay hidden={this.props.hidden}
               content={<LoadingIndicator />} />
    )
  }
}

LoadingIndicatorOverlay.propTypes = {
  hidden: PropTypes.bool.isRequired
};

export default LoadingIndicatorOverlay;