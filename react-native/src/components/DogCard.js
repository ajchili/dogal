import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Toggle from '../components/Toggle';
import breakfast from '../assets/icons8-pancake.png';
import lunch from '../assets/icons8-street-food.png';
import dinner from '../assets/icons8-thanksgiving.png';
import pee from '../assets/icons8-city-fire-hydrant.png';
import poo from '../assets/icons8-barbecue-sausages.png';
import walk from '../assets/icons8-trainers.png';

const { width } = Dimensions.get('window');

class DogCard extends Component {
  constructor(props) {
    super(props);
  }

  _renderDogCardFoodSwitch = time => {
    const { dog } = this.props;
    let selected = dog.food[time.toLowerCase()];
    let source = time.toLowerCase() === 'breakfast' ? breakfast :  time.toLowerCase() === 'lunch' ? lunch : dinner;

    return (
      <Toggle source={source}
              selected={selected}
              onPress={() => {
                this.props.handleUpdateFoodStatus(dog.name, time.toLowerCase(), !selected);
              }}/>
    );
  }

  _renderDogCardPottySwitch = time => {
    const { dog } = this.props;
    let peeSelected = dog.potty[time.toLowerCase()].pee;
    let pooSelected = dog.potty[time.toLowerCase()].poo;

    return (
      <View>
        <Toggle source={pee}
                selected={peeSelected}
                onPress={() => {
                  this.props.handleUpdateFoodStatus(dog.name, time.toLowerCase(), !peeSelected);
                }}/>
        <Toggle source={poo}
                selected={pooSelected}
                onPress={() => {
                  this.props.handleUpdateFoodStatus(dog.name, time.toLowerCase(), !pooSelected);
                }}/>
      </View>
    );
  }

  _renderDogCardWalkSwitch = time => {
    const { dog } = this.props;
    let selected = dog.walk[time.toLowerCase()];

    return (
      <Toggle source={walk}
              selected={selected}
              onPress={() => {
                this.props.handleUpdateFoodStatus(dog.name, time.toLowerCase(), !selected);
              }}/>
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