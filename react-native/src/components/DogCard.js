import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Toggle from './Toggle';
import {
  FireHydrant,
  Hamburger,
  Pancake,
  Poop,
  Spaghetti,
  Walking
} from '../assets/images';

const { width } = Dimensions.get('window');

class DogCard extends Component {
  _renderDogCardFoodSwitch = time => {
    const { dog } = this.props;
    let selected = dog.food[time.toLowerCase()];
    let source = time.toLowerCase() === 'breakfast' ? Pancake :  time.toLowerCase() === 'lunch' ? Hamburger : Spaghetti;

    return (
      <Toggle source={source}
              selected={selected}
              onPress={() => {
                this.props.handleUpdateFoodStatus(dog.name, time.toLowerCase(), !selected);
              }}/>
    );
  };

  _renderDogCardPottySwitch = time => {
    const { dog } = this.props;
    let peeSelected = dog.potty[time.toLowerCase()].pee;
    let pooSelected = dog.potty[time.toLowerCase()].poo;

    return (
      <View>
        <Toggle source={FireHydrant}
                selected={peeSelected}
                onPress={() => {
                  this.props.handleUpdatePottyStatus(dog.name, time.toLowerCase(), 'pee', !peeSelected);
                }}/>
        <Toggle source={Poop}
                selected={pooSelected}
                onPress={() => {
                  this.props.handleUpdatePottyStatus(dog.name, time.toLowerCase(), 'poo', !pooSelected);
                }}/>
      </View>
    );
  };

  _renderDogCardWalkSwitch = time => {
    const { dog } = this.props;
    let selected = dog.walk[time.toLowerCase()];

    return (
      <Toggle source={Walking}
              selected={selected}
              onPress={() => {
                this.props.handleUpdateWalkStatus(dog.name, time.toLowerCase(), !selected);
              }}/>
    );
  };

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