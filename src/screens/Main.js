import React, { Component } from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet
} from 'react-native';

class Start extends Component {
  static navigationOptions = {
    title: 'Dogal'
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="padding">
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  
});

export default Start;