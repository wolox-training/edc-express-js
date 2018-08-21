const { map } = require('lodash'),
  Model = require('../models/index'),
  logger = require('../../app/logger');

exports.updateUser = (req, res) => {
  Model.sequelize.sync().then(function() {
    Model.User.findOne({ id: req.param('id') })
      .then(user => {
        user.updateAttributes({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: req.body.password
        });
        return res.status(200).send({ message: 'User was updated', user });
      })
      .catch(err => {
        logger.error('User was not updated. ', err.message);
        return res.status(422).send({ message: map(err.errors, 'message') });
      });
  });
};
exports.deleteUser = (req, res) => {
  Model.sequelize.sync().then(function() {
    Model.User.destroy({
      where: { id: req.param('id') }
    })
      .then(user => {
        logger.log('User was deleted!', req);
        return res.status(200).send({ message: 'User was deleted' });
      })
      .catch(err => {
        logger.error('User was not deleted. ', err.message);
        return res.status(422).send({ message: map(err.errors, 'message') });
      });
  });
};
exports.getUser = (req, res) => {
  Model.sequelize.sync().then(function() {
    Model.User.findById(req.param('id'))
      .then(user => {
        logger.log('User found!', req);
        return res.status(200).send(user);
      })
      .catch(err => {
        logger.error('User was not found. ', err.message);
        return res.status(422).send({ message: map(err.errors, 'message') });
      });
  });
};
exports.getUsers = (req, res) => {
  Model.sequelize.sync().then(function() {
    Model.User.findAll()
      .then(users => {
        logger.log('List of users found!');
        return res.status(200).send(users);
      })
      .catch(err => {
        logger.error('Lis of user was not found. ', err.message);
        return res.status(422).send({ message: map(err.errors, 'message') });
      });
  });
};
exports.postUser = (req, res) => {
  Model.sequelize.sync().then(function() {
    Model.User.create(req.body)
      .then(user => {
        logger.info('User was created succesfully!');
        return res.status(200).send({ message: 'Created user.' });
      })
      .catch(err => {
        logger.error('User was not created. ', err.message);
        return res.status(422).send({ message: map(err.errors, 'message') });
      });
  });
};
