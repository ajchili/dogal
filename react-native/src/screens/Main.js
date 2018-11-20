import React, {Component} from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet
} from 'react-native';
import axios from 'axios';
import {Realtime} from 'ably';
import {ABLY_KEY} from 'react-native-dotenv';
import {
  DogCard,
  LoadingIndicator
} from '../components';
import {
  Dog,
  Family,
  User
} from '../dogal';

const {width} = Dimensions.get('window');
let ably, channel;

class Main extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: navigation.getParam('title', 'Your Family')
    };
  };

  state = {
    username: null,
    id: null,
    users: [],
    dogs: []
  };

  componentDidMount() {
    this._loadUserData();
    this._loadFamilyData();
  }

  _loadUserData = () => {
    User.getId()
      .then(id => {
        this.setState({id});
        // this._setupAbly(id);
      })
      .catch(() => this._displayError());
    User.getUsername()
      .then(username => this.setState({username}))
      .catch(() => this._displayError());
  };

  _loadFamilyData = () => {
    Family.getDogs()
      .then(dogs => {
        this.setState({dogs});
        dogs.forEach(dog => {
          Dog.getStatus(dog.id)
            .then(status => {
              let dogsCopy = JSON.parse(JSON.stringify(this.state.dogs));
              let index = dogsCopy.findIndex(_dog => _dog.id === dog.id);
              dogsCopy[index] = {
                ...dogsCopy[index],
                ...status
              };
              this.setState({dogs: dogsCopy});
            })
            .catch(() => this._displayError());
        });
      })
      .catch(() => this._displayError());
    Family.getName()
      .then(name => this.props.navigation.setParams({title: name}));
  };

  _displayError = () => {
    Alert.alert(
      'An Error Occurred',
      'Oops, please try again after restarting the app.'
    );
  };

  _setupAbly = id => {
    ably = new Realtime({
      key: ABLY_KEY,
      clientId: id
    });
    channel = ably.channels.get('persisted:dog-status');
    channel.attach(err => {
      if (err) {
        Alert.alert(
          'Unable to Connect to Server',
          'Please check your internet connection and re-start the app.',
          [
            {text: 'OK'},
          ],
          {cancelable: false}
        )
      } else {
        channel.subscribe(message => {
          if (message.clientId !== this.state.id) {
            this._handleAblyMessage(message);
          }
        });
        if (Platform.OS === 'ios') {
          channel.history((err, resultPage) => {
            if (err) {
              console.error(err);
              Alert.alert(
                'Unable to Connect to Server',
                'Please check your internet connection and re-start the app.',
                [
                  {text: 'OK'},
                ],
                {cancelable: false}
              );
            } else {
              let today = new Date();
              resultPage.items
                .sort((a, b) => a.timestamp - b.timestamp)
                .forEach(item => {
                  let date = new Date(item.timestamp);
                  if (today.getDate() === date.getDate()) {
                    this._handleAblyMessage(item);
                  }
                });
            }
          });
        } else {
          AblyHistory.get(ABLY_KEY, 'persisted:dog-status', err => {
            console.error(err);
            Alert.alert(
              'Unable to Connect to Server',
              'Please check your internet connection and re-start the app.',
              [
                {text: 'OK'},
              ],
              {cancelable: false}
            );
          }, history => {
            let today = new Date();
            let items = JSON.parse(history);
            items
              .sort((a, b) => a.timestamp - b.timestamp)
              .forEach(item => {
                let date = new Date(item.timestamp);
                if (today.getDate() === date.getDate()) {
                  this._handleAblyMessage(item);
                }
              });
          });
        }
      }
    });
  };

  _handleAblyMessage = message => {
    let data = message.data;
    // Copies array to prevent mutation of state.
    let dogsCopy = JSON.parse(JSON.stringify(this.state.dogs));
    switch (message.name) {
      case 'food-status':
        dogsCopy[data.dog].food[data.time] = data.fed;
        this.setState({
          dogs: dogsCopy
        });
        break;
      case 'potty-status':
        dogsCopy[data.dog].potty[data.time][data.type] = data.potty;
        this.setState({
          dogs: dogsCopy
        });
        break;
      case 'walk-status':
        dogsCopy[data.dog].walk[data.time] = data.walk;
        this.setState({
          dogs: dogsCopy
        });
        break;
      default:
        console.log('Message type not supported:', message);
        break;
    }
  };

  _handleUpdateStatus = (id, status) => {
    let dogsCopy = JSON.parse(JSON.stringify(this.state.dogs));
    let index = dogsCopy.findIndex(dog => dog.id === id);
    Object.keys(status).forEach(key => {
      Object.keys(status[key]).forEach(subKey => {
        let hasKeys = !!Object.keys(status[key][subKey]).length;
        if (hasKeys) {
          dogsCopy[index][key][subKey] = {
            ...dogsCopy[index][key][subKey],
            ...status[key][subKey]
          };
        } else {
          dogsCopy[index][key] = {
            ...dogsCopy[index][key],
            ...status[key]
          };
        }
      });
    });
    this.setState({dogs: dogsCopy});
  };

  render() {
    const {dogs} = this.state;

    let view = (
      <KeyboardAvoidingView behavior="padding">
        {!dogs.length ? (
          <LoadingIndicator/>
        ) : (
          <FlatList
            data={dogs}
            renderItem={({item}) => {
              return (<DogCard dog={item}
                               handleStatusUpdate={status => {
                                 this._handleUpdateStatus(item.id, status);
                               }}
                               handleStatusUpdateError={err => console.error(err)} />)
            }}
            keyExtractor={item => item.name}/>
        )}
      </KeyboardAvoidingView>
    );

    if (Platform.OS === 'ios') {
      return (
        <SafeAreaView style={styles.container}>
          {view}
        </SafeAreaView>
      );
    } else {
      return (
        <View style={styles.container}>
          {view}
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  dogCard: {
    width: width - 40,
    backgroundColor: '#ffffff',
    padding: 20,
    margin: 10,
    borderRadius: 6
  },
  dogCardTitle: {
    fontSize: 30
  },
  dogCardSubtitle: {
    fontSize: 20,
    marginTop: 5,
    marginBottom: 5
  },
  dogCardSliders: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});

export default Main;