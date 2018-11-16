import React, {Component} from 'react';
import {
  Modal,
  StyleSheet,
  View
} from 'react-native';
import PropTypes from 'prop-types';

class Overlay extends Component {
  render() {
    return (
      <Modal transparent
             visible={!this.props.hidden}>
        <View style={styles.overlay}>
          <View style={styles.content}>
            {this.props.content}
          </View>
        </View>
      </Modal>
    );
  }
}

Overlay.propTypes = {
  hidden: PropTypes.bool.isRequired,
  content: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  content: {
    padding: 20,
    borderRadius: 6,
    backgroundColor: '#ffffff',
  }
});

export default Overlay;