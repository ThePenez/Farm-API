/* eslint-disable consistent-return */
const { StatusCodes } = require('http-status-codes');
const { createCustomError } = require('../errors/custom-error');
const asyncWrapper = require('../middleware/async-wrapper');
const { Building, Unit } = require('../models');
const {
  unitFeedingInterval,
  unitMaxHealth,
  unitMinHealth,
  healthLost,
  unfeedableInterval,
  timeout,
} = require('./config_values');

const getAllUnits = async (req, res) => {
  res.send('get all units');
};

const getUnit = asyncWrapper(async (req, res, next) => {
  const { id: unitID } = req.params;
  const unit = await Unit.findByPk(unitID, { include: [{ model: Building, attributes: ['name'] }] });
  if (!unit) {
    return next(createCustomError(`No unit with id : ${unitID}`, 404));
  }
  res.status(StatusCodes.OK).json({ unit });
});

const addUnitToBuilding = asyncWrapper(async (req, res, next) => {
  const { type, buildingId } = req.body;
  const building = await Building.findByPk(buildingId);
  if (!building) {
    return next(createCustomError(`No building with id : ${buildingId}`, StatusCodes.NOT_FOUND));
  }
  if (!building.unitType.includes(type)) {
    return next(createCustomError(`A ${type} cannot be added to a ${building.name}`, StatusCodes.NOT_ACCEPTABLE));
  }
  const health = Math.floor(Math.random() * (unitMaxHealth - unitMinHealth + 1) + unitMinHealth);
  const unit = {
    type,
    health,
    alive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    BuildingId: buildingId,
    feedable: true,
  };
  const result = await Unit.create(unit);

  const feedingCountdown = setInterval(async () => {
    const unitToUpdate = await Unit.findByPk(result.id);
    if (unitToUpdate.health - healthLost <= 0) {
      await Unit
        .update(
          { health: 0, alive: false, feedable: false },
          { where: { id: unitToUpdate.id } },
        );
      // eslint-disable-next-line max-len
      const buildingToUpdate = await Building.findByPk(buildingId); // Called in the case of the number of units in a building changing during the interval so we have the updated value
      await Building
        .update(
          { numberOfUnits: buildingToUpdate.numberOfUnits - 1 },
          { where: { id: buildingToUpdate.id } },
        );
      clearInterval(feedingCountdown);
    } else {
      await Unit
        .update(
          { health: unitToUpdate.health - healthLost },
          { where: { id: unitToUpdate.id } },
        );
    }
  }, unitFeedingInterval);
  const resultBuilding = await Building
    .update({ numberOfUnits: building.numberOfUnits + 1 }, { where: { id: buildingId } });
  res.status(StatusCodes.CREATED).json({ result, resultBuilding });
});

const feedUnit = asyncWrapper(async (req, res, next) => { // feed unit
  const { id: unitID } = req.params;
  const unit = await Unit.findByPk(unitID);
  if (!unit.feedable) {
    return next(createCustomError('This unit cannot be fed', StatusCodes.NOT_ACCEPTABLE));
  }
  const result = await Unit
    .update({ health: unit.health + 1, feedable: false }, { where: { id: unitID } });
  await timeout(unfeedableInterval);
  const result2 = await Unit
    .update({ feedable: true }, { where: { id: unitID } });
  res.status(StatusCodes.OK).json({ result, result2, success: true });
});

const deleteUnit = asyncWrapper(async (req, res, next) => { // ***NEEDS TO CLEAR INTERVAL***
  const { id: unitID } = req.params;

  const unit = await Unit.findByPk(unitID);
  const buildingToUpdate = await Building.findByPk(unit.BuildingId);
  if (!buildingToUpdate) {
    return next(createCustomError(`No building with id : ${unit.BuildingId} where unit with id: ${unitID} is currently located`, StatusCodes.NOT_FOUND));
  }
  await Building
    .update(
      { numberOfUnits: buildingToUpdate.numberOfUnits - 1 },
      { where: { id: buildingToUpdate.id } },
    );

  const result = await Unit.destroy({ where: { id: unitID } });
  if (!result) {
    return next(createCustomError(`No unit with id : ${unitID}`, StatusCodes.NOT_FOUND));
  }
  res.status(200).json({ result });
});

module.exports = {
  getAllUnits,
  getUnit,
  addUnitToBuilding,
  feedUnit,
  deleteUnit,
};
