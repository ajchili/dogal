import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  AsyncStorage,
  KeyboardAvoidingView,
  Image,
  Text,
  TextInput,
  StyleSheet,
  View
} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import axios from 'axios';
import Trust from "../assets/icons8-trust.png";

class Start extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    username: '',
    loadedUsername: '',
    loaded: false
  };

  componentWillMount() {
    this._loadUsername();
  }

  _loadUsername = async () => {
    try {
      const value = await AsyncStorage.getItem('username');

      if (!!value) this._resetNavigation();
      else {
        this.setState({
          loadedUsername: value || '',
          loaded: true
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

    if (username.trim().length >= 3) {
      Alert.alert(
        'Set username?',
        `Set your username to "${username.trim()}"?`,
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'OK', onPress: () => {
            this._setUsername(username.trim());
          }},
        ],
        { cancelable: false }
      )
    } else if (username.trim().length) {
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
      this.setState({
        loadedUsername: username
      });
      this._writeToDatabase(username);
    } catch (error) {
      Alert.alert(
        'An Error Occurred!',
        'This is bad, please try again after restarting the app.',
        [
          {text: 'OK'},
        ],
        { cancelable: false }
      );
    }
  }

  _setId = async id => {
    try {
      await AsyncStorage.setItem('id', id);
      this._resetNavigation();
    } catch (error) {
      Alert.alert(
        'An Error Occurred!',
        'This is bad, please try again after restarting the app.',
        [
          {text: 'OK'},
        ],
        { cancelable: false }
      );
    }
  }

  _writeToDatabase = username => {
    axios({
      method: 'POST',
      url: 'https://us-central1-dogal-220802.cloudfunctions.net/setUsername',
      data: {
        username
      }
    })
      .then(res => {
        if (res.status === 200) {
          this._setId(res.data.id);
        } else {
          Alert.alert(
            'An Error Occurred!',
            'Please ensure you have an internet connection and try again!',
            [
              {text: 'OK'},
            ],
            { cancelable: false }
          )
        }
      })
      .catch(err => {
        Alert.alert(
          'An Error Occurred!',
          err.message,
          [
            {text: 'OK'},
          ],
          { cancelable: false }
        );
      });
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
    const { username, loadedUsername, loaded } = this.state;

    return (
      <KeyboardAvoidingView style={styles.container}
                            behavior="padding">
        {loaded && !loadedUsername ? (
            <View>
              <View style={styles.imageContainer}>
                <Image source={Trust}
                       style={styles.image}
                       blurRadius={.2} />
              </View>
              <Text style={styles.title}>
                Let's get started
              </Text>
              <Text style={styles.subTitle}>
                and keep track of your dogs with your family
              </Text>
              <TextInput style={styles.username}
                         placeholder={'Username'}
                         onChangeText={username => this.setState({ username })}
                         onSubmitEditing={this._validateUsername}
                         value={username} />
            </View>
        ) : ( 
          <ActivityIndicator/>
        )}
      </KeyboardAvoidingView>
    );
  }
}

const imageSize = 175;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: imageSize,
    height: imageSize
  },
  title: {
    paddingTop: 30,
    paddingBottom: 4,
    paddingLeft: 30,
    paddingRight: 30,
    fontSize: 28,
    textAlign: 'center'
  },
  subTitle: {
    paddingBottom: 30,
    paddingLeft: 30,
    paddingRight: 30,
    fontSize: 25,
    textAlign: 'center'
  },
  username: {
    padding: 20,
    marginLeft: 30,
    marginRight: 30,
    fontSize: 20,
    backgroundColor: '#eeeeee',
    borderRadius: 6
  }
});

export default Start;