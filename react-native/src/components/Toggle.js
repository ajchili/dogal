import React, { Component } from 'react';
import {
  Image,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import { Grayscale } from 'react-native-color-matrix-image-filters';

class Toggle extends Component {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        {this.props.selected === true ? (
          <Image source={this.props.source}
                 style={{
                   width: 64,
                   height: 64
                 }} />
        ) : (
          <Grayscale>
            <Image source={this.props.source}
                   style={{
                     width: 64,
                     height: 64
                   }} />
          </Grayscale>
        )}
      </TouchableOpacity>
    );
  }
}

Toggle.propTypes= {
  onPress: PropTypes.func,
  selected: PropTypes.bool.isRequired,
  source: PropTypes.object.isRequired
};

export default Toggle;