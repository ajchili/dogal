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
          morbreakfastning: false,
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

  _renderDogCard = dog => {
    return (
      <View style={styles.dogCard}>
        <Text style={styles.dogCardTitle}>{dog.name}</Text>
        <Text style={styles.dogCardSubtitle}>Have I been fed?</Text>
        <View style={styles.dogCardSliders}>
          {this._renderDogCardFoodSwitch('Breakfast', dog.food.breakfast)}
          {this._renderDogCardFoodSwitch('Lunch', dog.food.lunch)}
          {this._renderDogCardFoodSwitch('Dinner', dog.food.dinner)}
        </View>
        <Text style={styles.dogCardSubtitle}>Have I gone potty?</Text>
        <View style={styles.dogCardSliders}>
          {this._renderDogCardPottySwitch('Morning', dog.potty.morning)}
          {this._renderDogCardPottySwitch('Noon', dog.potty.noon)}
          {this._renderDogCardPottySwitch('Night', dog.potty.night)}
        </View>
        <Text style={styles.dogCardSubtitle}>Have I gone on a walk?</Text>
        <View style={styles.dogCardSliders}>
          {this._renderDogCardWalkSwitch('Morning', dog.walk.morning)}
          {this._renderDogCardWalkSwitch('Noon', dog.walk.noon)}
          {this._renderDogCardWalkSwitch('Night', dog.walk.night)}
        </View>
      </View>
    );
  }

  _renderDogCardFoodSwitch = (time, checked) => {
    return (
      <View>
        <Text>{time}</Text>
        <Switch />
      </View>
    );
  }

  _renderDogCardPottySwitch = (time, potty) => {
    return (
      <View>
        <Text>{time} - Pee</Text>
        <Switch />
        <Text>{time} - Poo</Text>
        <Switch />
      </View>
    );
  }

  _renderDogCardWalkSwitch = (time, checked) => {
    return (
      <View>
        <Text>{time}</Text>
        <Switch />
      </View>
    );
  }

  _renderPlatformSpecificUI = () => {
    const { users, dogs } = this.state;

    if (Platform.OS === 'ios') {

      return (
        <SafeAreaView style={styles.container}>
          <KeyboardAvoidingView behavior="padding">
          {!users.length ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              data={dogs}
              renderItem={({item}) => this._renderDogCard(item)}
              keyExtractor={(item) => item.name}/>
          )}
          </KeyboardAvoidingView>
        </SafeAreaView>
      );
    } else {
      return (
        <KeyboardAvoidingView style={styles.container}
                              behavior="padding">
        {!users.length ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={dogs}
            renderItem={({item}) => this._renderDogCard(item)}
            keyExtractor={(item) => item.name}/>
        )}
        </KeyboardAvoidingView>
      );
    }
  }

  render() {
    return this._renderPlatformSpecificUI();
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