'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Achievement', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        name: {
          type: Sequelize.STRING
        },
        level: {
          type: Sequelize.INTEGER
        },
        logoUrl: {
          type: Sequelize.INTEGER
        }
      })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Achievement');
  }
};