'use strict';

const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {

    static associate(models) {
      Role.belongsToMany(models.user, {
        through: 'user_roles',
        onDelete: 'CASCADE',
      });
    }
  }
  Role.init({
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'role',
  });
  return Role;
};

