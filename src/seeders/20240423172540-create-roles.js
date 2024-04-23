'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('roles', [
      {
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        role: "moderator",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
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
