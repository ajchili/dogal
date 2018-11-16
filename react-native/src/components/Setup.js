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
import {
  Family,
  User
} from "../dogal";
import {Images} from '../assets';
import LoadingIndicator from './LoadingIndicator';
import LoadingIndicatorOverlay from './LoadingIndicatorOverlay';

class Setup extends Component {
  state = {
    screen: -1,
    username: '',
    family: '',
    dog: '',
    loaded: false,
    preformingNetworkAction: false,
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
        if (!!username) this._checkForFamily();
        else this.setState({loaded: true});
      })
      .catch(err => {
        console.error(err);
      });
  };

  _checkForFamily = () => {
    Family.getId()
      .then(id => {
        this.setState({
          screen: !!id ? 2 : 1,
          loaded: true
        });
      })
      .catch(err => {
        console.error(err);
      });
  };

  _setUsername = () => {
    const {username} = this.state;

    this.setState({preformingNetworkAction: true});

    if (username.trim().length >= 3) {
      User.setUsername(username)
        .then(() => {
          this.setState({
            screen: 1,
            preformingNetworkAction: false
          });
        })
        .catch(() => {
          this.setState({preformingNetworkAction: false});
          this._displayError();
        });
    } else {
      Alert.alert(
        'Invalid Username',
        'Your username must be at least 3 characters long!'
      );
    }
  };

  _setFamily = () => {
    const {family} = this.state;

    this.setState({preformingNetworkAction: true});

    if (family.trim().length >= 3) {
      User.getId()
        .then(id => {
          Family.create(id, family.trim())
            .then(() => {
              this.setState({
                screen: 2,
                preformingNetworkAction: false
              });
            })
            .catch(() => {
              this.setState({preformingNetworkAction: false});
              this._displayError();
            });
        })
        .catch(() => {
          this.setState({preformingNetworkAction: false});
          this._displayError();
        });
    } else {
      Alert.alert(
        'Invalid Family Name',
        'Your family name must be at least 3 characters long!'
      );
    }
  };

  _joinFamily = family => {
    if (family.length) {
      User.getId()
        .then(id => {
          Family.join(id, family.trim())
            .then(() => this.setState({screen: 2}))
            .catch(() => this._displayError());
        })
        .catch(() => this._displayError());
    } else {
      Alert.alert(
        'Invalid Family Id',
        'No family id provided!'
      );
    }
  };

  _displayError = () => {
    Alert.alert(
      'An Error Occurred',
      'Oops, please try again after restarting the app.'
    );
  };

  render() {
    const { screen, loaded, preformingNetworkAction } = this.state;

    const loadingView = <View style={styles.loadingContainer}>
      <LoadingIndicator/>
    </View>;

    if (!loaded) {
      return (loadingView);
    } else {
      return (
        <View>
          <LoadingIndicatorOverlay hidden={!preformingNetworkAction} />
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
                     style={styles.input} />
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
    image: Images.NameTag
  },
  {
    title: 'Create a family',
    subTitle: 'or join one',
    inputPlaceholder: 'Family Name',
    image: Images.Family,
    extraContent: <Button title={"Join"}/>
  },
  {
    title: 'Add a dog',
    subTitle: 'to get started with dogal',
    inputPlaceholder: 'Dog Name',
    image: Math.random() > .5 ? Images.Dog : Images.Corgi
  }
];

export default Setup;