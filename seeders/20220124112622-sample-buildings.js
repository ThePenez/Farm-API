module.exports = {
  // eslint-disable-next-line no-unused-vars
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert(
      'Buildings',
      [
        {
          name: 'Stable',
          unitType: 'Horse',
          numberOfUnits: '0',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Cowshed',
          unitType: 'Cow',
          numberOfUnits: '0',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],

      {},
    );
  },

  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Buildings', null, {});
  },
};
