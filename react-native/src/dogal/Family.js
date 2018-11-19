import {AsyncStorage} from 'react-native';
import axios from 'axios';

let id = null;

module.exports = {
  getId: () => {
    return new Promise(async (resolve, reject) => {
      if (id) return resolve(id);
      try {
        const value = await AsyncStorage.getItem('family');
        id = value;
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
  getName: () => {
    return new Promise((resolve, reject) => {
      module.exports.getId()
        .then(id => {
          axios({
            method: 'GET',
            url: 'https://us-central1-dogal-220802.cloudfunctions.net/getFamily',
            params: {
              id
            }
          })
            .then(res => {
              if (res.status === 200) resolve(res.data.name);
              else reject(res.data);
            })
            .catch(err => reject(err));
        })
        .catch(err => reject(err));
    });
  },
  create: (id, name) => {
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
            if (res.status === 200) {
              module.exports.join(id, res.data.id)
                .then(() => resolve())
                .catch(err => reject(err));
            }
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
            if (res.status === 200) {
              module.exports.setId(family)
                .then(() => resolve())
                .catch(err => reject(err));
            }
            else reject(res.data);
          })
          .catch(err => reject(err));
      } else reject(new Error('No id or family provided!'));
    });
  },
  getDogs: () => {
    return new Promise((resolve, reject) => {
      module.exports.getId()
        .then(id => {
            axios({
              method: 'GET',
              url: 'https://us-central1-dogal-220802.cloudfunctions.net/getDogs',
              params: {
                family: id
              }
            })
              .then(res => resolve(res.data))
              .catch(err => reject(err));
        })
        .catch(err => reject(err));
    });
  }
};
