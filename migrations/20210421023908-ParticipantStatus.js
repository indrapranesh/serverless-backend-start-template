'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ParticipantStatus', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        status: {
          type: Sequelize.STRING
        }
      })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('ParticipantStatus');
  }
};