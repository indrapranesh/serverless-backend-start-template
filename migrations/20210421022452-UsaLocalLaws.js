'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('UsaLocalLaw', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        state: {
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
    return queryInterface.dropTable('UsaLocalLaw');
  }
};