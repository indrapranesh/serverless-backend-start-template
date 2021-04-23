'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Participant', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        userId: {
            type: Sequelize.INTEGER,
            references: {
              model: 'User',
              key: 'id',
            }
        },
        eventId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Event',
            key: 'id',
          }
        },
        status: {
          type: Sequelize.INTEGER,
          references: {
            model: 'ParticipantStatus',
            key: 'id',
          }
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
    return queryInterface.dropTable('Participant');
  }
};