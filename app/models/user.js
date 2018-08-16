'use strict';

const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      firstName: {
        required: true,
        allowNull: false,
        type: DataTypes.STRING
      },
      lastName: {
        required: true,
        allowNull: false,
        type: DataTypes.STRING
      },
      email: {
        required: true,
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        lowercase: true,
        validate: {
          isEmail: true,
          notEmpty: true
        }
      },
      password: {
        required: true,
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          is: {
            args: ['^[a-zA-Z0-9]+$', 'i'],
            msg: 'Password require alphanumeric value.'
          },
          len: {
            args: [8, 50],
            msg: 'Password length is not in this range.'
          }
        }
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    },
    {
      indexes: [{ unique: true, fields: ['id'] }, { unique: true, fields: ['email'] }],
      validate: {
        isWoloxDomain() {
          if (
            this.email.search(/^[a-zA-Z0-9_.+-]+@(?:(?:[a-zA-Z0-9-]+\.)?[a-zA-Z]+\.)?(wolox)\.com$/g) !== 0
          ) {
            throw new Error('Domain of email is not valid.');
          }
        }
      }
    }
  );
  User.beforeCreate((user, options) => {
    return bcrypt
      .hash(user.password, 10)
      .then(hash => {
        user.password = hash;
      })
      .catch(err => {
        throw new Error();
      });
  });
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};