import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  AsyncStorage,
  KeyboardAvoidingView,
  Text,
  TextInput,
  StyleSheet,
  View
} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';

class Start extends Component {
  static navigationOptions = {
    title: 'Welcome',
  };

  constructor(props) {
    super(props);
  }

  state = {
    username: '',
    loadedUsername: false
  };

  componentWillMount() {
    this._loadUsername();
  }

  _loadUsername = async () => {
    const { navigate } = this.props.navigation;

    try {
      const value = await AsyncStorage.getItem('username');

      if (!!value) this._resetNavigation();
      else {
        this.setState({
          username: value || '',
          loadedUsername: true
        });
      }
    } catch (error) {
      Alert.alert(
        'An Error Occurred!',
        'This is bad, please try again after restarting the app.',
        [
          {text: 'OK'},
        ],
        { cancelable: false }
      )
    }
  }

  _validateUsername = () => {
    const { username } = this.state;

    if (username.trim.length >= 3) {
      Alert.alert(
        'Set username?',
        `Set your username to "${username.trim}"?`,
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'OK', onPress: () => {
            this._setUsername(username.trim)
          }},
        ],
        { cancelable: false }
      )
    } else {
      Alert.alert(
        'Inavlid username!',
        'Your username must be at least three characters long!',
        [
          {text: 'OK'},
        ],
        { cancelable: false }
      )
    }
  }

  _setUsername = async username => {
    try {
      await AsyncStorage.setItem('username', username);
    } catch (error) {
      Alert.alert(
        'An Error Occurred!',
        'This is bad, please try again after restarting the app.',
        [
          {text: 'OK'},
        ],
        { cancelable: false }
      )
    }
  }

  _resetNavigation = () => {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Main' }),
      ],
    });
    
    this.props.navigation.dispatch(resetAction);
  }

  render() {
    const { username, loadedUsername } = this.state;

    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        {loadedUsername ? (
          <View>
            {!username ? (
              <View>
                <Text style={styles.title}>
                  Uh oh!
                  {'\n'}
                  Looks like you haven't set your username!
                  {'\n\n\n'}
                  Let's change that!
                </Text>
                <TextInput style={styles.username}
                          placeholder={'Username'}
                          onChangeText={username => this.setState({ username })}
                          onSubmitEditing={() => this._validateUsername()}
                          value={username} />
              </View>
            ) : (
              <View>
                <Text style={styles.title}>
                  Welcome back!
                  {'\n'}
                  Please wait as we load your information!
                </Text>
                <ActivityIndicator/>
              </View>
            )}
          </View>
        ) : ( 
          <ActivityIndicator/>
        )}
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    padding: 20,
    fontSize: 20,
    textAlign: 'center'
  },
  username: {
    padding: 20
  }
});

export default Start;