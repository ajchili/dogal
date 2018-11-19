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
  }
};
