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
import {Dog} from '../dogal';
import LoadingIndicator from './LoadingIndicator';
import LoadingIndicatorOverlay from './LoadingIndicatorOverlay';
import PropType from 'prop-types';

const { width } = Dimensions.get('window');

class DogCard extends Component {
  state = {
    loading: false,
  };

  _updateStatus = (id, status) => {
    this.setState({loading: true});
    Dog.updateStatus(id, status)
      .then(() => {
        this.setState({loading: false});
        this.props.handleStatusUpdate(status);
      })
      .catch(err => {
        this.setState({loading: false});
        this.props.handleStatusUpdateError(err);
      });
  };

  _renderDogCardFoodSwitch = time => {
    const { dog } = this.props;
    time = time.toLowerCase();
    let selected = dog.food[time];
    let source = time === 'breakfast' ? Pancake :  time === 'lunch' ? Hamburger : Spaghetti;

    return (
      <Toggle source={source}
              selected={selected}
              onPress={() => {
                let status = {food: {}};
                status.food[time] = !selected;
                this._updateStatus(dog.id, status);
              }}/>
    );
  };

  _renderDogCardPottySwitch = time => {
    const { dog } = this.props;
    time = time.toLowerCase();
    let peeSelected = dog.potty[time].pee;
    let pooSelected = dog.potty[time].poo;

    return (
      <View>
        <Toggle source={FireHydrant}
                selected={peeSelected}
                onPress={() => {
                  let status = {potty: {}};
                  status.potty[time] = {pee: !peeSelected};
                  this._updateStatus(dog.id, status);
                }}/>
        <Toggle source={Poop}
                selected={pooSelected}
                onPress={() => {
                  let status = {potty: {}};
                  status.potty[time] = {poo: !pooSelected};
                  this._updateStatus(dog.id, status);
                }}/>
      </View>
    );
  };

  _renderDogCardWalkSwitch = time => {
    const { dog } = this.props;
    time = time.toLowerCase();
    let selected = dog.walk[time];

    return (
      <Toggle source={Walking}
              selected={selected}
              onPress={() => {
                let status = {walk: {}};
                status.walk[time] = !selected;
                this._updateStatus(dog.id, status);
              }}/>
    );
  };

  render() {
    const {loading} = this.state;
    const {dog} = this.props;
    const hasLoaded = !!dog.food && !!dog.potty && !!dog.walk;

    return (
      <View style={styles.dogCard}>
        <Text style={styles.dogCardTitle}>{dog.name}</Text>
        {!hasLoaded ? (
          <View style={styles.loadingContainer}>
            <LoadingIndicator />
          </View>
        ) : (
          <View>
            <LoadingIndicatorOverlay hidden={!loading}/>
            {dog.food &&
            <View>
              <Text style={styles.dogCardSubtitle}>Have I been fed?</Text>
              <View style={styles.dogCardSliders}>
                {this._renderDogCardFoodSwitch('Breakfast')}
                {this._renderDogCardFoodSwitch('Lunch')}
                {this._renderDogCardFoodSwitch('Dinner')}
              </View>
            </View>
            }
            {dog.potty &&
            <View>
              <Text style={styles.dogCardSubtitle}>Have I gone potty?</Text>
              <View style={styles.dogCardSliders}>
                {this._renderDogCardPottySwitch('Morning')}
                {this._renderDogCardPottySwitch('Noon')}
                {this._renderDogCardPottySwitch('Night')}
              </View>
            </View>
            }
            {dog.walk &&
            <View>
              <Text style={styles.dogCardSubtitle}>Have I gone on a walk?</Text>
              <View style={styles.dogCardSliders}>
                {this._renderDogCardWalkSwitch('Morning')}
                {this._renderDogCardWalkSwitch('Noon')}
                {this._renderDogCardWalkSwitch('Night')}
              </View>
            </View>
            }
          </View>
        )}
      </View>
    );
  }
}

DogCard.propTypes = {
  dog: PropType.object.isRequired,
  handleStatusUpdate: PropType.func.isRequired,
  handleStatusUpdateError: PropType.func.isRequired
};

const styles = StyleSheet.create({
  dogCard: {
    width: width - 40,
    backgroundColor: '#ffffff',
    padding: 20,
    margin: 10,
    borderRadius: 6
  },
  loadingContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
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