'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert(
      'Buildings',
      [
        {
          name: 'Stable',
          UnitType: 'Horse',
          numberOfUnits: '0',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Cowshed',
          UnitType: 'Cow',
          numberOfUnits: '0',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],

      {},
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Buildings', null, {});
  },
};
