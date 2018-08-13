const { map } = require('lodash');
const Model = require('../models/index');

exports.list = (req, res) => {
  return res.send('bla bla');
};
exports.save = (req, res) => {
  Model.sequelize.sync().then(function() {
    Model.User.create(req.body)
      .then(user => {
        return res.send({ statusCode: 200, message: 'Created user.' });
      })
      .catch(err => {
        return res.status(422).send({ message: map(err.errors, 'message') });
      });
  });
};
