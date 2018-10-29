import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  Switch,
  Text,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

class DogCard extends Component {
  constructor(props) {
    super(props);
  }

  _renderDogCardFoodSwitch = time => {
    const { dog } = this.props;
    let checked = dog.food[time.toLowerCase()];

    return (
      <View>
        <Text>{time}</Text>
        <Switch onValueChange={value => {
                  this.props.handleUpdateFoodStatus(dog.name, time.toLowerCase(), value);
                }}
                value={checked} />
      </View>
    );
  }

  _renderDogCardPottySwitch = time => {
    const { dog } = this.props;

    return (
      <View>
        <Text>{time} - Pee</Text>
        <Switch onValueChange={value => {
                  this.props.handleUpdatePottyStatus(dog.name, time.toLowerCase(), 'pee', value);
                }}
                value={dog.potty[time.toLowerCase()].pee} />
        <Text>{time} - Poo</Text>
        <Switch onValueChange={value => {
                  this.props.handleUpdatePottyStatus(dog.name, time.toLowerCase(), 'poo', value);
                }}
                value={dog.potty[time.toLowerCase()].poo} />
      </View>
    );
  }

  _renderDogCardWalkSwitch = time => {
    const { dog } = this.props;

    return (
      <View>
        <Text>{time}</Text>
        <Switch onValueChange={value => {
                  this.props.handleUpdateWalkStatus(dog.name, time.toLowerCase(), value);
                }}
                value={dog.walk[time.toLowerCase()]} />
      </View>
    );
  }

  render() {
    const { dog } = this.props;

    return (
      <View style={styles.dogCard}>
        <Text style={styles.dogCardTitle}>{dog.name}</Text>
        <Text style={styles.dogCardSubtitle}>Have I been fed?</Text>
        <View style={styles.dogCardSliders}>
          {this._renderDogCardFoodSwitch('Breakfast')}
          {this._renderDogCardFoodSwitch('Lunch')}
          {this._renderDogCardFoodSwitch('Dinner')}
        </View>
        <Text style={styles.dogCardSubtitle}>Have I gone potty?</Text>
        <View style={styles.dogCardSliders}>
          {this._renderDogCardPottySwitch('Morning')}
          {this._renderDogCardPottySwitch('Noon')}
          {this._renderDogCardPottySwitch('Night')}
        </View>
        <Text style={styles.dogCardSubtitle}>Have I gone on a walk?</Text>
        <View style={styles.dogCardSliders}>
          {this._renderDogCardWalkSwitch('Morning')}
          {this._renderDogCardWalkSwitch('Noon')}
          {this._renderDogCardWalkSwitch('Night')}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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

export default DogCard;