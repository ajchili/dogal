import React, {Component} from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet
} from 'react-native';
import {
  StackActions,
  NavigationActions
} from 'react-navigation';
import {Setup} from '../components';

class Start extends Component {
  static navigationOptions = {
    header: null
  };

  _resetNavigation = () => {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({routeName: 'Main'}),
      ],
    });

    this.props.navigation.dispatch(resetAction);
  };

  render() {
    return (
      <KeyboardAvoidingView style={styles.container}
                            behavior={"padding"}>
        <Setup onComplete={this._resetNavigation} />
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