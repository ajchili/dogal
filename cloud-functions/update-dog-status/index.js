const cors = require('cors')({ origin: true });
const Datastore = require('@google-cloud/datastore');

const projectId = 'dogal-220802';

exports.updateDogStatus = (req, res) => {
  cors(req, res, () => {
    if (req.method !== 'POST') {
      res.status(404).send('Method must be of type POST!');
    } else if (!req.body.id) {
      res.status(400).send('Missing id of dog!');
    } else if (!req.body.status) {
      res.status(400).send('Missing update status of dog!');
    } else {
      const datastore = new Datastore({ projectId });

      let query = datastore
        .createQuery('Dogs')
        .filter('__key__', '=', datastore.key(['Dogs', parseInt(req.body.id)]));

      datastore
        .runQuery(query)
        .then(results => {
          if (results[0].length === 1) {
            const kind = 'DogsStatuses';
            const statusKey = datastore.key(kind);

            const status = {
              key: statusKey,
              data: {
                dog: parseInt(req.body.id),
                status: req.body.status,
                time: new Date().getTime()
              },
            };

            datastore
              .save(status)
              .then(() => res.status(200).json({ id: statusKey.id }))
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
};
