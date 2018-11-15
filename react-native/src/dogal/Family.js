import {AsyncStorage} from 'react-native';
import axios from 'axios';

module.exports = {
  getId: () => {
    return new Promise(async (resolve, reject) => {
      try {
        const value = await AsyncStorage.getItem('family');
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
          await AsyncStorage.setItem('family', id);
          resolve();
        } catch (err) {
          reject(err);
        }
      } else {
        reject(new Error('No id provided!'));
      }
    });
  },
  create: name => {
    return new Promise(async (resolve, reject) => {
      if (!!name) {
        axios({
          method: 'POST',
          url: 'https://us-central1-dogal-220802.cloudfunctions.net/createFamily',
          data: {
            name
          }
        })
          .then(async res => {
            if (res.status === 200) return module.exports.setId(res.data.id);
            else reject(res.data);
          })
          .catch(err => reject(err));
      } else reject(new Error('No name provided!'));
    });
  },
  join: (id, family) => {
    return new Promise(async (resolve, reject) => {
      if (!!id && !!family) {
        axios({
          method: 'POST',
          url: 'https://us-central1-dogal-220802.cloudfunctions.net/joinFamily',
          data: {
            id,
            family
          }
        })
          .then(res => {
            if (res.status === 200) return module.exports.setId(res.data.id);
            else reject(res.data);
          })
          .catch(err => reject(err));
      } else reject(new Error('No id or family provided!'));
    });
  }
};
