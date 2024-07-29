'use strict';
const {Roles} = require('../config/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('roles', [
      {
        id: Roles.USER,
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: Roles.MODERATOR,
        role: "moderator",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: Roles.ADMIN,
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
      await queryInterface.bulkDelete('roles', null, {});
  }
};
