/* eslint-disable max-len */
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
  feedingCountdowns,
  feedAllUnitsIntervals,
} = require('./config_values');

const getAllUnits = async (req, res) => { // GET id, type, health, aliveness and the building they're in for all farm units
  const units = await Unit.findAll({ raw: true, attributes: ['id', 'type', 'health', 'alive', 'BuildingId'] });
  console.log(units);
  res.status(StatusCodes.OK).json(units);
};

const getUnit = asyncWrapper(async (req, res, next) => { // GET id and name of the building it's in for a specific farm unit
  const { id: unitID } = req.params;
  const unit = await Unit.findByPk(unitID, { include: [{ model: Building, attributes: ['name'] }] });
  if (!unit) {
    return next(createCustomError(`No unit with id : ${unitID}`, StatusCodes.NOT_FOUND));
  }
  res.status(StatusCodes.OK).json({ unit });
});

const addUnitToBuilding = asyncWrapper(async (req, res, next) => { // POST create a unit with given type and random health, add it to a building, start it's feeding countdown
  const { type, buildingId } = req.body;
  const building = await Building.findByPk(buildingId);
  if (!building) {
    return next(createCustomError(`No building with id : ${buildingId}`, StatusCodes.NOT_FOUND));
  }
  if (!building.unitType.includes(type)) {
    return next(createCustomError(`A ${type} cannot be added to a ${building.name}`, StatusCodes.NOT_ACCEPTABLE));
  }
  const health = Math.floor(Math.random() * (unitMaxHealth - unitMinHealth + 1) + unitMinHealth); // Sets health to a random number between unitHealthMax and unitHealthMin
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
  feedAllUnitsIntervals[String(result.BuildingId)][String(result.id)] = 0;
  feedingCountdowns[String(result.id)] = setInterval(async () => { // Can be a function by itself, sets feeding countdown
    const unitToUpdate = await Unit.findByPk(result.id);
    if (unitToUpdate.health - healthLost <= 0) {
      await Unit
        .update(
          { health: 0, alive: false, feedable: false },
          { where: { id: unitToUpdate.id } },
        );
      const buildingToUpdate = await Building.findByPk(buildingId); // Called in the case of the number of units in a building changing during the interval so we have the updated value
      await Building
        .update(
          { numberOfUnits: buildingToUpdate.numberOfUnits - 1 },
          { where: { id: buildingToUpdate.id } },
        );
      clearInterval(feedingCountdowns[String(unitToUpdate.id)]);
      delete feedingCountdowns[String(unitToUpdate.id)];
      delete feedAllUnitsIntervals[String(unitToUpdate.BuildingId)][String(unitToUpdate.id)]; // If the unit dies stop it's feeding countdown and delete her from the building feeding list
    } else {
      await Unit
        .update(
          { health: unitToUpdate.health - healthLost },
          { where: { id: unitToUpdate.id } },
        );
      feedAllUnitsIntervals[String(unitToUpdate.BuildingId)][String(unitToUpdate.id)] += healthLost; // Update health lost in the previous interval so it can regain half of it
      console.log(`Unit with id: ${unitToUpdate.id} lost ${healthLost} health`);
    }
  }, unitFeedingInterval);
  // console.log(feedingCountdowns);
  const resultBuilding = await Building
    .update({ numberOfUnits: building.numberOfUnits + 1 }, { where: { id: buildingId } });
  res.status(StatusCodes.CREATED).json({ result, resultBuilding });
});

const feedUnit = asyncWrapper(async (req, res, next) => { // PATCH feed unit with given id, add health to it and make it unfeedable for the set amount of miliseconds
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

const deleteUnit = asyncWrapper(async (req, res, next) => { // DELETE a unit, stop it's feeding countdown and delete it from the array of intervals
  const { id: unitID } = req.params;

  const unit = await Unit.findByPk(unitID);
  if (unit.alive) {
    const buildingToUpdate = await Building.findByPk(unit.BuildingId);
    if (!buildingToUpdate) {
      return next(createCustomError(`No building with id : ${unit.BuildingId} where unit with id: ${unitID} is currently located`, StatusCodes.NOT_FOUND));
    }
    await Building
      .update(
        { numberOfUnits: buildingToUpdate.numberOfUnits - 1 }, // Decrement number of units in the building
        { where: { id: buildingToUpdate.id } },
      );

    clearInterval(feedingCountdowns[String(unitID)]); // Stop unit's feeding countdown
    delete feedingCountdowns[String(unitID)]; // Delete it from the array
  }
  const result = await Unit.destroy({ where: { id: unitID } });
  if (!result) {
    return next(createCustomError(`No unit with id : ${unitID}`, StatusCodes.NOT_FOUND));
  }
  res.status(StatusCodes.OK).json({ result });
});

module.exports = {
  getAllUnits,
  getUnit,
  addUnitToBuilding,
  feedUnit,
  deleteUnit,
};
