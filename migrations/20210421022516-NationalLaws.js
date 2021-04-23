'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('NationalLaw', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        country: {
          type: Sequelize.STRING
        },
        description: {
          type: Sequelize.STRING
        },
        reference: {
          type: Sequelize.STRING
        }
      })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('NationalLaw');
  }
};