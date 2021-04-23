'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('User', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        firstName: {
            type: Sequelize.STRING
        },
        lastName: {
            type: Sequelize.STRING
        },
        userName: {
            type: Sequelize.STRING
        },
        cognitoUserName: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        phoneNumber: {
            type: Sequelize.STRING
        },
        isFirstLogin: {
            type: Sequelize.BOOLEAN
        },
        createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
          },
        updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
          }
      })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('User');
  }
};