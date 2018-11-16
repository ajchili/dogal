const cors = require('cors')({ origin: true });
const Datastore = require('@google-cloud/datastore');

const projectId = 'dogal-220802';

exports.createDog = (req, res) => {
  cors(req, res, () => {
    if (req.method !== 'POST') {
      res.status(404).send('Method must be of type POST!');
    } else if (!req.body.name) {
      res.status(400).send('Missing name for dog!');
    } else if (!req.body.family) {
      res.status(400).send('Missing family of dog!');
    } else {
      const datastore = new Datastore({ projectId });

      let query = datastore
        .createQuery('Families')
        .filter('__key__', '=', datastore.key(['Families', parseInt(req.body.family)]));

      datastore
        .runQuery(query)
        .then(results => {
          if (results[0].length === 1) {
            const kind = 'Dogs';
            const dogKey = datastore.key(kind);

            const dog = {
              key: dogKey,
              data: {
                name: req.body.name,
                family: req.body.family
              },
            };

            datastore
              .save(dog)
              .then(() => res.status(200).json({ id: dogKey.id }))
              .catch(err => {
                console.error('ERROR:', err);
                res.status(500).send();
              });
          } else res.status(404).send();
        })
        .catch(err => {
          console.error('ERROR:', err);
          res.status(500).send();
        });
    }
  });
}