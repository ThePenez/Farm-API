'use strict';

// const {
//   Model,
// } = require('sequelize');

// module.exports = (sequelize, DataTypes) => {
//   class Building extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       this.hasMany(models.Unit, { as: 'units' });
//     }
//   }
//   Building.init({
//     name: DataTypes.STRING,
//     unitType: DataTypes.STRING,
//     numberOfUnits: DataTypes.INTEGER,
//   }, {
//     sequelize,
//     modelName: 'Building',
//   });
//   return Building;
// };

module.exports = (sequelize, DataTypes) => {
  const Building = sequelize.define('Building', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    unitType: DataTypes.STRING,
    numberOfUnits: DataTypes.INTEGER,
  }, {});

  Building.associate = (models) => {
    Building.hasMany(models.Unit, {as: 'units'});
  };
  return Building;
};
