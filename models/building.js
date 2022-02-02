import Sequelize from 'sequelize';
import db from './index.js';

const Building = db.sequelize.define('Building', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  name: Sequelize.STRING,
  unitType: {
    type: Sequelize.STRING,
  },
  numberOfUnits: Sequelize.INTEGER,
}, {});

Building.associate = (models) => {
  Building.hasMany(models.Unit, { as: 'units' });
};

export default Building;
