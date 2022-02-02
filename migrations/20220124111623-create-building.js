const up = async (queryInterface, Sequelize) => queryInterface.createTable('Buildings', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
  },
  name: {
    type: Sequelize.STRING,
  },
  unitType: {
    type: Sequelize.STRING,
  },
  numberOfUnits: {
    type: Sequelize.INTEGER,
  },
  createdAt: {
    allowNull: false,
    type: Sequelize.DATE,
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE,
  },
});

const down = async (queryInterface) => queryInterface.dropTable('Buildings');

export { up, down };
