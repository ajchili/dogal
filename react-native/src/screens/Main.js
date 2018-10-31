import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  AsyncStorage,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  View
} from 'react-native';
import axios from 'axios';
import { Realtime } from 'ably';
import { ABLY_KEY } from 'react-native-dotenv';
import DogCard from '../components/DogCard';

const { width } = Dimensions.get('window');
let ably, channel;
const day = 86400;

class Start extends Component {
  static navigationOptions = {
    title: 'Dogal'
  };

  constructor(props) {
    super(props);
  }

  state = {
    username: null,
    id: null,
    users: [],
    dogs: [
      {
        name: 'Alaska',
        food: {
          breakfast: false,
          lunch: false,
          dinner: false
        },
        potty: {
          morning: {
            pee: false,
            poo: false
          },
          noon: {
            pee: false,
            poo: false
          },
          night: {
            pee: false,
            poo: false
          }
        },
        walk: {
          morning: false,
          noon: false,
          night: false
        }
      },
      {
        name: 'Eric',
        food: {
          breakfast: false,
          lunch: false,
          dinner: false
        },
        potty: {
          morning: {
            pee: false,
            poo: false
          },
          noon: {
            pee: false,
            poo: false
          },
          night: {
            pee: false,
            poo: false
          }
        },
        walk: {
          morning: false,
          noon: false,
          night: false
        }
      }
    ]
  };

  componentDidMount() {
    this._loadUserData();
    this._loadUsers();
  }

  _loadUserData = async () => {
    try {
      const username = await AsyncStorage.getItem('username');
      const id = await AsyncStorage.getItem('id');
      this.setState({
        username,
        id
      });
      this._setupAbly(id);
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

  _setupAbly = id => {
    ably = new Realtime({
      key: ABLY_KEY,
      clientId: id
    });
    channel = ably.channels.get('dog-status');
    channel.attach(err => {
      if (err) {
        Alert.alert(
          'Unable to Connect to Server',
          'Please check your internet connection and re-start the app.',
          [
            {text: 'OK'},
          ],
          { cancelable: false }
        )
      } else {
        channel.subscribe(message => {
          if (message.clientId !== this.state.id) {
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
          }
        });
      }
    });
  }

  _loadUsers = () => {
    axios({
      method: 'GET',
      url: 'https://us-central1-dogal-220802.cloudfunctions.net/getUsers'
    })
      .then(res => {
        if (res.status === 200) {
          this.setState({
            users: res.data
          });
        } else {
          Alert.alert(
            'Unable to Connect to Server',
            'Please check your internet connection and re-start the app.',
            [
              {text: 'OK'},
            ],
            { cancelable: false }
          )
        }
      })
      .catch(() => {
        Alert.alert(
          'Unable to Connect to Server',
          'Please check your internet connection and re-start the app.',
          [
            {text: 'OK'},
          ],
          { cancelable: false }
        )
      });
  }

  _handleUpdateFoodStatus = (dog, time, value) => {
    // Copies array to prevent mutation of state.
    let dogsCopy = JSON.parse(JSON.stringify(this.state.dogs));
    dogsCopy[dog === 'Alaska' ? 0 : 1].food[time] = value;
    this.setState({
      dogs: dogsCopy
    });
    if (channel) {
      channel.publish('food-status', {
        dog: dog === 'Alaska' ? 0 : 1,
        time,
        fed: value
      });
    }
  }

  _handleUpdatePottyStatus = (dog, time, type, value) => {
    // Copies array to prevent mutation of state.
    let dogsCopy = JSON.parse(JSON.stringify(this.state.dogs));
    dogsCopy[dog === 'Alaska' ? 0 : 1].potty[time][type] = value;
    this.setState({
      dogs: dogsCopy
    });
    if (channel) {
      channel.publish('potty-status', {
        dog: dog === 'Alaska' ? 0 : 1,
        time,
        type,
        potty: value
      });
    }
  }

  _handleUpdateWalkStatus = (dog, time, value) => {
    // Copies array to prevent mutation of state.
    let dogsCopy = JSON.parse(JSON.stringify(this.state.dogs));
    dogsCopy[dog === 'Alaska' ? 0 : 1].walk[time] = value;
    this.setState({
      dogs: dogsCopy
    });
    if (channel) {
      channel.publish('walk-status', {
        dog: dog === 'Alaska' ? 0 : 1,
        time,
        walk: value
      });
    }
  }
  
  render() {
    const { users, dogs } = this.state;

    let view = (
      <KeyboardAvoidingView behavior="padding">
        {!users.length ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={dogs}
            renderItem={({item}) => {
              return(<DogCard dog={item}
                              handleUpdateFoodStatus={this._handleUpdateFoodStatus}
                              handleUpdatePottyStatus={this._handleUpdatePottyStatus}
                              handleUpdateWalkStatus={this._handleUpdateWalkStatus} />)
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
      return view;
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

export default Start;