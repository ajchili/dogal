import { AsyncStorage } from 'react-native';
import axios from 'axios';

module.exports = {
  getId: () => {
    return new Promise(async (resolve, reject) => {
      try {
        const value = await AsyncStorage.getItem('id');
        resolve(value);
      } catch (err) {
        reject(err);
      }
    });
  },
  setId: id => {
    return new Promise(async (resolve, reject) => {
      if (!!id) {
        try {
          await AsyncStorage.setItem('id', id);
          resolve();
        } catch (err) {
          reject(err);
        }
      } else {
        reject(new Error('No id provided!'));
      }
    });
  },
  getUsername: () => {
    return new Promise(async (resolve, reject) => {
      try {
        const value = await AsyncStorage.getItem('username');
        resolve(value);
      } catch (err) {
        reject(err);
      }
    });
  },
  setUsername: username => {
    return new Promise((resolve, reject) => {
      if (!!username) {
        axios({
          method: 'POST',
          url: 'https://us-central1-dogal-220802.cloudfunctions.net/setUsername',
          data: {
            username
          }
        })
          .then(res => {
            if (res.status === 200) return this.setId(res.data.id);
            else reject(res.data);
          })
          .catch(err => reject(err));
      } else {
        reject(new Error('No username provided!'));
      }
    });
  }
};