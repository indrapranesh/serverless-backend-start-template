'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('UserAchievementMapper', {
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
        achievementId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Achievement',
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
    return queryInterface.dropTable('UserAchievementMapper');
  }
};