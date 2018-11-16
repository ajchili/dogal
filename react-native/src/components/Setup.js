import React, {Component} from 'react';
import {
  Alert,
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import {User} from "../dogal";
import {
  Family,
  NameTag,
  Dog
} from '../assets/images';
import LoadingIndicator from "./LoadingIndicator";

class Setup extends Component {
  state = {
    screen: -1,
    username: '',
    family: ''
  };

  componentDidMount() {
    this._checkForUsername();
  }

  _checkForUsername = () => {
    User.getUsername()
      .then(username => {
        this.setState({
          screen: !!username ? 1 : 0
        });
      })
      .catch(err => {
        console.error(err);
      });
  };

  _setUsername = () => {
    const {username} = this.state;

    if (username.trim().length >= 3) {
      User.setUsername(username)
        .then(() => this.setState({screen: 1}))
        .catch(() => this._displayError());
    } else {
      Alert.alert(
        'Invalid Username',
        'Your username must be at least 3 characters long!'
      );
    }
  };

  _setFamily = () => {
    const {family} = this.state;
  };

  _joinFamily = family => {

  };

  _displayError = () => {
    Alert.alert(
      'An Error Occurred',
      'Oops, please try again after restarting the app.'
    );
  };

  render() {
    const { screen } = this.state;

    switch (screen) {
      case -1:
        return (
          <View style={styles.loadingContainer}>
            <LoadingIndicator/>
          </View>
        );
      default:
        return (
          <View>
            <View style={styles.imageContainer}>
              <Image source={screens[screen].image}
                     style={styles.image} />
            </View>
            <Text style={styles.title}>
              {screens[screen].title}
            </Text>
            <Text style={styles.subTitle}>
              {screens[screen].subTitle}
            </Text>
            <TextInput placeholder={screens[screen].inputPlaceholder}
                       onChangeText={value => {
                         switch (screen) {
                           case 0:
                             this.setState({
                               username: value
                             });
                             break;
                           case 1:
                             this.setState({
                               family: value
                             });
                             break;
                         }
                       }}
                       onSubmitEditing={() => {
                         switch (screen) {
                           case 0:
                             this._setUsername();
                             break;
                           case 1:
                             this._setFamily();
                             break;
                         }
                       }}
                       style={styles.input}/>
            <View style={styles.extraContentContainer}>
              {screens[screen].extraContent}
            </View>
          </View>
        );
    }
  }
}

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
  extraContentContainer: {
    paddingTop: 30,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: 100,
    height: 100
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
  input: {
    padding: 20,
    marginLeft: 30,
    marginRight: 30,
    fontSize: 20,
    backgroundColor: '#eeeeee',
    borderRadius: 6
  }
});

const screens = [
  {
    title: 'Let\'s get started',
    subTitle: 'please enter a username',
    inputPlaceholder: 'Username',
    image: NameTag
  },
  {
    title: 'Create a family',
    subTitle: 'or join one below',
    inputPlaceholder: 'Family Name',
    image: Family,
    extraContent: <Button title={"Join"}/>
  },
  {
    title: 'Add dogs!',
    subTitle: '',
    image: Dog
  }
];

export default Setup;