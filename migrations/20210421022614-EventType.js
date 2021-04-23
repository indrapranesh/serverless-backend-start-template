'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('EventType', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        type: {
          type: Sequelize.STRING
        }
      })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('EventType');
  }
};