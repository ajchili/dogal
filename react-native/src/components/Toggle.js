import React, { Component } from 'react';
import {
  Image,
  TouchableOpacity,
} from 'react-native';
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

export default Toggle;