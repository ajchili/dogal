import React, {Component} from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet
} from 'react-native';
import {Setup} from '../components';

class Start extends Component {
  static navigationOptions = {
    header: null
  };

  render() {
    return (
      <KeyboardAvoidingView style={styles.container}
                            behavior={"padding"}>
        <Setup />
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default Start;