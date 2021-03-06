const cors = require('cors')({ origin: true });
const Datastore = require('@google-cloud/datastore');

const projectId = 'dogal-220802';

exports.getUsers = (req, res) => {
  cors(req, res, () => {
    if (req.method !== 'GET') {
      res.status(404).send('Method must be of type GET!');
    } else {
      const datastore = new Datastore({ projectId });

      let query = datastore
        .createQuery('Users');
      
      datastore
        .runQuery(query)
        .then(results => {
          let data = results[0].map(result => {
            return {
              id: result[datastore.KEY].id,
              ...result
            }
          });
          res.status(200).json(data);
        })
        .catch(err => {
          console.error('ERROR:', err);
          res.status(500).send();
        });
    }
  });
}