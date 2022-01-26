'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'Units', // name of Source model
    'feedable', // name of the column we're adding
    {
      type: Sequelize.BOOLEAN,
    },
  ),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn(
    'Units', // name of Source model
    'feedable', // column we want to remove
  ),
};
