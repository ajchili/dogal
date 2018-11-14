const cors = require('cors')({ origin: true });
const Datastore = require('@google-cloud/datastore');

const projectId = 'dogal-220802';

exports.createFamily = (req, res) => {
  cors(req, res, () => {
    if (req.method !== 'POST') {
      res.status(404).send('Method must be of type POST!');
    } else if (!req.body.name) {
      res.status(400).send('Missing name for family!');
    } else {
      const datastore = new Datastore({ projectId });
      
      const kind = 'Families';
      const familyKey = datastore.key(kind);
      
      const family = {
        key: familyKey,
        data: {
          name: req.body.name
        },
      };
      
      datastore
        .save(family)
        .then(() => res.status(200).json({ id: familyKey.id }))
        .catch(err => {
          console.error('ERROR:', err);
          res.status(500).send();
        });
    }
  });
}