'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.renameColumn('Buildings', 'UnitType', 'unitType');
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.renameColumn('Buildings', 'unitType', 'UnitType');
  },
};
