const cors = require('cors')({ origin: true });
const Datastore = require('@google-cloud/datastore');

const projectId = 'dogal-220802';

exports.setDogStatus = (req, res) => {
  cors(req, res, () => {
    if (req.method !== 'POST') {
      res.status(404).send('Method must be of type POST!');
    } else if (!req.body.dog) {
      res.status(400).send('Dog must be specified!');
    } else if (!req.body.food && !req.body.potty && !req.body.walk) {
      res.status(400).send('Dog activity (food, potty or walk) must be specified!');
    } else {
      const datastore = new Datastore({ projectId });

      const kind = 'DogStatus';
      const statusKey = datastore.key(kind);
      
      const status = {
        key: statusKey,
        data: {
          dog: req.body.dog,
          food: req.body.food,
          potty: req.body.potty,
          walk: req.body.walk,
          time: new Date().getTime()
        },
      };
      
      datastore
        .save(status)
        .then(() => res.status(200).send())
        .catch(err => {
          console.error('ERROR:', err);
          res.status(500).send();
        });
    }
  });
}