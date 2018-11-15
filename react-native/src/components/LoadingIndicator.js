import React, { Component } from 'react';
import {
  Animated,
  Easing,
  StyleSheet
} from 'react-native';
import { Load } from '../assets/images';

class LoadingIndicator extends Component {
  constructor () {
    super();

    this.spinValue = new Animated.Value(0);
  }

  componentDidMount() {
    this._spin();
  }

  _spin() {
    this.spinValue.setValue(0);
    Animated.timing(
      this.spinValue,
      {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear
      }
    ).start(() => this._spin())
  }

  render() {
    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    });

    return (
      <Animated.Image source={Load}
                      style={{
                        ...styles.image,
                        transform: [{rotate: spin}],
                      }} />
    )
  }
}

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
  },
});

export default LoadingIndicator;