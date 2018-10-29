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
import DogCard from '../components/DogCard';

const { width } = Dimensions.get('window');

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

        }
      })
      .catch(err => {});
  }

  _handleUpdateFoodStatus = (dog, time, value) => {
    // Copies array to prevent mutation of state.
    let dogsCopy = JSON.parse(JSON.stringify(this.state.dogs));
    dogsCopy[dog === 'Alaska' ? 0 : 1].food[time] = value;
    this.setState({
      dogs: dogsCopy
    });
  }

  _handleUpdatePottyStatus = (dog, time, type, value) => {
    // Copies array to prevent mutation of state.
    let dogsCopy = JSON.parse(JSON.stringify(this.state.dogs));
    dogsCopy[dog === 'Alaska' ? 0 : 1].potty[time][type] = value;
    this.setState({
      dogs: dogsCopy
    });
  }

  _handleUpdateWalkStatus = (dog, time, value) => {
    // Copies array to prevent mutation of state.
    let dogsCopy = JSON.parse(JSON.stringify(this.state.dogs));
    dogsCopy[dog === 'Alaska' ? 0 : 1].walk[time] = value;
    this.setState({
      dogs: dogsCopy
    });
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