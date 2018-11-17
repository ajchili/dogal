const cors = require('cors')({ origin: true });
const Datastore = require('@google-cloud/datastore');

const projectId = 'dogal-220802';

exports.getFamily = (req, res) => {
  cors(req, res, () => {
    if (req.method !== 'GET') {
      res.status(404).send('Method must be of type GET!');
    } else if (!req.query.id) {
      res.status(400).send('Missing id of family!');
    } else {
      const datastore = new Datastore({ projectId });

      let query = datastore
        .createQuery('Families')
        .filter('__key__', '=', datastore.key(['Families', parseInt(req.query.id)]));

      datastore
        .runQuery(query)
        .then(results => {
          if (results[0].length === 1) {
            let data = results[0].map(result => {
              return {
                id: result[datastore.KEY].id,
                ...result
              }
            })[0];
            res.status(200).json(data);
          } else res.status(404).send();
        })
        .catch(err => {
          console.error('ERROR:', err);
          res.status(500).send();
        });
    }
  });
};
