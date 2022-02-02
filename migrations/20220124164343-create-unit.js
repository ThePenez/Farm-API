const up = async (queryInterface, Sequelize) => queryInterface.createTable('Units', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
  },
  type: {
    type: Sequelize.STRING,
  },
  health: {
    type: Sequelize.INTEGER,
  },
  alive: {
    type: Sequelize.BOOLEAN,
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

const down = async (queryInterface) => queryInterface.dropTable('Units');

export { up, down };
