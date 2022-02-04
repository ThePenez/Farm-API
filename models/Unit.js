module.exports = (sequelize, DataTypes) => {
  const Unit = sequelize.define('Unit', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.STRING,
    },
    health: DataTypes.INTEGER,
    alive: DataTypes.BOOLEAN,
    feedable: DataTypes.BOOLEAN,
  }, {});

  Unit.associate = (models) => {
    Unit.belongsTo(models.Building, { foreignKey: 'BuildingId' });
  };

  return Unit;
};
