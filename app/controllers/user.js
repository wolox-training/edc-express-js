const { map } = require('lodash');
const Model = require('../models/index');
const logger = require('../../app/logger');

exports.list = (req, res) => {
  return res.status(200).send('bla bla');
};
exports.save = (req, res) => {
  Model.sequelize.sync().then(function() {
    Model.User.create(req.body)
      .then(user => {
        logger.info('User was created succesfully!');
        return res.send({ statusCode: 200, message: 'Created user.' });
      })
      .catch(err => {
        logger.error('User was not created. ', err.message);
        return res.status(422).send({ message: map(err.errors, 'message') });
      });
  });
};
