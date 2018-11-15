import React, {Component} from 'react';
import {
  Alert,
  AsyncStorage,
  KeyboardAvoidingView,
  Image,
  Text,
  TextInput,
  StyleSheet,
  View
} from 'react-native';
import {StackActions, NavigationActions} from 'react-navigation';
import {Family} from '../assets/images';
import {LoadingIndicator} from '../components';
import {
  RandomQuoteGenerator,
  User
} from '../dogal';

class Start extends Component {
  static navigationOptions = {
    header: null
  };

  state = {
    username: '',
    loadedUsername: '',
    loaded: false
  };

  componentWillMount() {
    this._load();
  }

  _load = () => {
    User.getUsername()
      .then(username => {
        if (!!username) this._resetNavigation();
        else {
          this.setState({
            loadedUsername: username || '',
            loaded: true
          });
        }
      })
      .catch(() => {
        Alert.alert(
          'An Error Occurred!',
          'Oops, please try again after restarting the app.',
          [
            {text: 'OK'},
          ],
          {cancelable: false}
        )
      });
  };

  _validateUsername = () => {
    const {username} = this.state;

    if (username.trim().length >= 3) {
      Alert.alert(
        'Set username?',
        `Set your username to "${username.trim()}"?`,
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'OK', onPress: () => {
              User.setUsername(username.trim());
            }
          },
        ],
        {cancelable: false}
      )
    } else if (username.trim().length) {
      Alert.alert(
        'Invalid username!',
        'Your username must be at least three characters long!',
        [
          {text: 'OK'},
        ],
        {cancelable: false}
      )
    }
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
    const {username, loadedUsername, loaded} = this.state;

    return (
      <KeyboardAvoidingView style={styles.container}
                            behavior="padding">
        {loaded && !loadedUsername ? (
          <View>
            <View style={styles.imageContainer}>
              <Image source={Family}
                     style={styles.image}/>
            </View>
            <Text style={styles.title}>
              Let's get started
            </Text>
            <Text style={styles.subTitle}>
              and keep track of your dogs with your family
            </Text>
            <TextInput style={styles.username}
                       placeholder={'Username'}
                       onChangeText={username => this.setState({username})}
                       onSubmitEditing={this._validateUsername}
                       value={username}/>
          </View>
        ) : (
          <View style={styles.loadingContainer}>
            <Text style={styles.subTitle}>
              {RandomQuoteGenerator.generate().toLowerCase()}
            </Text>
            <LoadingIndicator/>
          </View>
        )}
      </KeyboardAvoidingView>
    );
  }
}

const imageSize = 100;

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
  loadingContainer: {
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