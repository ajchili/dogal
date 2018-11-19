const cors = require('cors')({ origin: true });
const Datastore = require('@google-cloud/datastore');

const projectId = 'dogal-220802';

exports.getDogStatus = (req, res) => {
  cors(req, res, () => {
    if (req.method !== 'GET') {
      res.status(404).send('Method must be of type GET!');
    } else if (!req.query.id) {
      res.status(400).send('Missing id of dog!');
    } else {
      const datastore = new Datastore({ projectId });
      const epochDay = 86400 * 1000;
      const day = Math.floor(new Date().getTime()/epochDay)*epochDay;

      let query = datastore
        .createQuery('DogsStatuses')
        .filter('time', '>=', day)
        .order('time', {
          descending: false
        });

      datastore
        .runQuery(query)
        .then(results => {
          let status = {
            food: {
              breakfast: false,
              lunch: false,
              dinner: false
            },
            potty: {
              morning: false,
              noon: false,
              afternoon: false,
              night: false
            },
            walk: {
              morning: false,
              noon: false,
              afternoon: false,
              night: false
            }
          };
          results[0]
            .filter(result => result.dog === parseInt(req.query.id))
            .forEach(result => {
            let resultStatus = JSON.parse(result.status);
            Object.keys(resultStatus).forEach(key => {
              Object.keys(resultStatus[key]).forEach(subKey => {
                status[key][subKey] = resultStatus[key][subKey];
              });
            });
          });
          res.status(200).json(status);
        })
        .catch(err => {
          console.error('ERROR:', err);
          res.status(500).send();
        });
    }
  });
};
