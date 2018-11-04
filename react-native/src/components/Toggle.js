import React, { Component } from 'react';
import {
  Image,
  TouchableOpacity,
} from 'react-native';
import { Grayscale } from 'react-native-color-matrix-image-filters';

class Toggle extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        {this.props.selected === true ? (
          <Image source={this.props.source} />
        ) : (
          <Grayscale>
            <Image source={this.props.source} />
          </Grayscale>
        )}
      </TouchableOpacity>
    );
  }
}

export default Toggle;