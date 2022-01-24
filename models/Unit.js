'use strict';

// const { Model } = require('sequelize');

// module.exports = (sequelize, DataTypes) => {
//   class Unit extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       this.belongsTo(models.Building, { foreignKey: 'buildingId', as: 'building' });
//     }
//   }
//   Unit.init({
//     type: DataTypes.STRING,
//     health: DataTypes.INTEGER,
//     alive: DataTypes.BOOLEAN,
//   }, {
//     sequelize,
//     modelName: 'Unit',
//   });
//   return Unit;
// };

module.exports = (sequelize, DataTypes) => {
  const Unit = sequelize.define('Unit', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    type: DataTypes.STRING,
    health: DataTypes.INTEGER,
    alive: DataTypes.BOOLEAN,
    feedable: DataTypes.BOOLEAN,
  }, {});

  Unit.associate = (models) => {
    Unit.belongsTo(models.Building, { foreignKey: 'BuildingId' });
  };

  return Unit;
};
