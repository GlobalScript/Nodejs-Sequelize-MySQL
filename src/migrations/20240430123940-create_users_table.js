'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstname: {
        type: Sequelize.STRING,
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
        type: Sequelize.STRING,
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
        type: Sequelize.STRING,
        allowNull: false
      },
      nickname: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      avatar: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isCorrectPhoneNumber(value) {
            if (!/^\+380\d{9}$/.test(value)) {
              throw new Error('Invalid phone number format');
            }
          }
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};
