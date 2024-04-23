'use strict';

const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {

    static associate(models) {
      User.belongsToMany(models.role, {
        through: 'user_roles',
        onDelete: 'CASCADE',
      });
    }
  }
  User.init({
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [1, 50],
          msg: "First name must be at least 1 characters long"
        },
        isAlpha: {
          msg: "First name must contain only letters"
        }
      }
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [1, 50],
          msg: "Last name must be at least 1 characters long"
        },
        isAlpha: {
          msg: "Last name must contain only letters"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nickname: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isCorrectPhoneNumber(value) {
          if (!/^\+380\d{9}$/.test(value)) {
            throw new Error('Invalid phone number format');
          }
        },
      },
    }
  }, {
    sequelize,
    modelName: 'user',
  });
  return User;
};
