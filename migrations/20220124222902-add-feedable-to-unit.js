module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'Units', // name of Source model
    'feedable', // name of the column we're adding
    {
      type: Sequelize.BOOLEAN,
    },
  ),

  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => queryInterface.removeColumn(
    'Units', // name of Source model
    'feedable', // column we want to remove
  ),
};
