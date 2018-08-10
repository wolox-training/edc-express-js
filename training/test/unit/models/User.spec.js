const { sequelize, dataTypes, checkModelName, checkPropertyExists } = require('sequelize-test-helpers');
const UserModel = require('../../../app/models/user');

describe('src/models/user', () => {
  const Model = UserModel(sequelize, dataTypes);
  const instance = new Model();
  checkModelName(Model)('User');
  context('properties', () => {
    ['name', 'email'].forEach(checkPropertyExists(instance));
  });
});
