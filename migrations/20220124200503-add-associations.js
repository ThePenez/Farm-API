const up = async (queryInterface, Sequelize) => queryInterface.addColumn(
  'Units', // name of Source model
  'BuildingId', // name of the key we're adding
  {
    type: Sequelize.INTEGER,
    references: {
      model: 'Buildings', // name of Target model
      key: 'id', // key in Target model that we're referencing
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
);

const down = async (queryInterface) => queryInterface.removeColumn(
  'Units', // name of Source model
  'BuildingId', // key we want to remove
);

export { up, down };
