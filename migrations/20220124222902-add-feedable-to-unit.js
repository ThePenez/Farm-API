import Sequelize from "sequelize";

const up = async (queryInterface) => queryInterface.addColumn(
  'Units', // name of Source model
  'feedable', // name of the column we're adding
  {
    type: Sequelize.BOOLEAN,
  },
);

const down = async (queryInterface) => queryInterface.removeColumn(
  'Units', // name of Source model
  'feedable', // column we want to remove
);

export { up, down };
