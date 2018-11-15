const cors = require('cors')({ origin: true });
const Datastore = require('@google-cloud/datastore');

const projectId = 'dogal-220802';

exports.setUsername = (req, res) => {
  cors(req, res, () => {
    if (req.method !== 'POST') {
      res.status(404).send('Method must be of type POST!');
    } else if (!req.body.username) {
      res.status(400).send('Username of user must be provied!');
    } else if (req.body.username.length < 3) {
      res.status(403).send('Username must be at least 3 characters long!');
    } else {
      const datastore = new Datastore({ projectId });

      if (req.body.id) {
        const transaction = datastore.transaction();
        const userKey = datastore.key(['Users', parseInt(req.body.id)]);

        transaction
          .run()
          .then(() => transaction.get(userKey))
          .then(results => {
            const user = results[0];
            user.username = req.body.username;
            transaction.save({
              key: userKey,
              data: user,
            });
            return transaction.commit();
          })
          .then(() => res.status(200).send())
          .catch(() => {
            transaction.rollback(() => res.status(500).send());
          });
      } else {
        const kind = 'Users';
        const userKey = datastore.key(kind);
        
        const user = {
          key: userKey,
          data: {
            username: req.body.username
          },
        };
        
        datastore
          .save(user)
          .then(() => res.status(200).json({ id: userKey.id }))
          .catch(err => {
            console.error('ERROR:', err);
            res.status(500).send();
          });
      }
    }
  });
}