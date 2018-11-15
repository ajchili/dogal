const cors = require('cors')({ origin: true });
const Datastore = require('@google-cloud/datastore');

const projectId = 'dogal-220802';

exports.joinFamily = (req, res) => {
  cors(req, res, () => {
    if (req.method !== 'POST') {
      res.status(404).send('Method must be of type POST!');
    } else if (!req.body.family) {
      res.status(400).send('Missing id for family!');
    } else if (!req.body.id) {
      res.status(400).send('Missing user id!');
    } else {
      const datastore = new Datastore({ projectId });
      const transaction = datastore.transaction();
      const userKey = datastore.key(['Users', parseInt(req.body.id)]);

      transaction
        .run()
        .then(() => transaction.get(userKey))
        .then(results => {
          let user = results[0];
          if (user) {
            user.family = req.body.family;
            transaction.save({
              key: userKey,
              data: user,
            });
            return transaction.commit();
          } else {
            console.log(results);
            res.status(404).send();
          }
        })
        .then(() => res.status(200).send())
        .catch(err => {
          console.error(err);
          transaction.rollback(() => res.status(500).send());
        });
    }
  });
};