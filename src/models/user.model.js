'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {

    static associate(models) {
      User.belongsToMany(models.role, {
        through: 'user_roles',
        onDelete: 'CASCADE',
      });
      User.hasMany(models.order, {
        onDelete: 'CASCADE',
      });
      User.hasOne(models.basket, {
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
          msg: "First name must be at least 1 character long"
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
          msg: "Last name must be at least 1 character long"
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
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isCorrectPhoneNumber(value) {
          if (!/^\+38\s\d{3}\s\d{3}\s\d{2}\s\d{2}$/.test(value)) {
            throw new Error('Invalid phone number format. Expected format: +38 098 443 25 54');
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
