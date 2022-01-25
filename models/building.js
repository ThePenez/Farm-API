'use strict';
module.exports = (sequelize, DataTypes) => {
  const Building = sequelize.define('Building', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    unitType: {
      type: DataTypes.STRING,
    },
    numberOfUnits: DataTypes.INTEGER,
  }, {});

  Building.associate = (models) => {
    Building.hasMany(models.Unit, { as: 'units' });
  };
  return Building;
};
