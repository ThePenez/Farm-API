'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert(
      'Units',
      [
        {
          type: 'Horse',
          health: 60,
          alive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          BuildingId: 1,
        },
        {
          type: 'Horse',
          health: 100,
          alive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          BuildingId: 1,
        },
        {
          type: 'Horse',
          health: 80,
          alive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          BuildingId: 1,
        },
      ],

      {},
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Units', null, {});
  },
};
