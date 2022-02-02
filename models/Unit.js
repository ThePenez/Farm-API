import Sequelize from 'sequelize';
import db from './index.js';

const Unit = db.sequelize.define('Unit', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  type: {
    type: Sequelize.STRING,
  },
  health: Sequelize.INTEGER,
  alive: Sequelize.BOOLEAN,
  feedable: Sequelize.BOOLEAN,
}, {});

Unit.associate = (models) => {
  Unit.belongsTo(models.Building, { foreignKey: 'BuildingId' });
};

export default Unit;