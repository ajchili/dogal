import axios from 'axios';

module.exports = {
  create: (name, family) => {
    return new Promise((resolve, reject) => {
      if (!!name && !!family) {
        axios({
          method: 'POST',
          url: 'https://us-central1-dogal-220802.cloudfunctions.net/createDog',
          data: {
            name,
            family
          }
        })
          .then(() => resolve())
          .catch(err => reject(err));
      } else reject(new Error('No name or family provided!'));
    });
  },
  getStatus: id => {
    return new Promise((resolve, reject) => {
      if (!!id) {
        axios({
          method: 'GET',
          url: `https://us-central1-dogal-220802.cloudfunctions.net/getDogStatus?id=${id}`
        })
          .then(res => resolve(res.data))
          .catch(err => reject(err));
      } else reject(new Error('No dog id provided!'));
    });
  },
  updateStatus: (id, status) => {
    return new Promise((resolve, reject) => {
      if (!!id) {
        axios({
          method: 'Post',
          url: 'https://us-central1-dogal-220802.cloudfunctions.net/updateDogStatus',
          data: {
            id,
            status: JSON.stringify(status)
          }
        })
          .then(res => resolve(res.data))
          .catch(err => reject(err));
      } else reject(new Error('No dog id provided!'));
    })
  }
};
