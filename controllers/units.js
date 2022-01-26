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
  manualFeedingGain,
} = require('./config_values');

// ***FUNCTIONS***
function removeInterval(unitID) {
  clearInterval(feedingCountdowns[String(unitID)]); // Stop units feeding countdown
  delete feedingCountdowns[String(unitID)]; // Delete it from the array
}
async function changeNumberOfUnits(buildingID, increment) { // Incerements or decrements the number of units in a building
  const buildingToUpdate = await Building.findByPk(buildingID); // Called in case the number of units in a building changes during the interval so we have the updated value
  if (!buildingToUpdate) {
    return Promise.reject();
  }
  await Building
    .update(
      { numberOfUnits: buildingToUpdate.numberOfUnits + increment },
      { where: { id: buildingToUpdate.id } },
    );
}

async function unitDeath(unitID, buildingID) { // Declares that a unit is not alive or feedable and decreases number of units in building
  await Unit
    .update(
      { health: 0, alive: false, feedable: false },
      { where: { id: unitID } },
    );
  await changeNumberOfUnits(buildingID, -1);
}

// ***ROUTES***
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
  feedAllUnitsIntervals[String(result.BuildingId)][String(result.id)] = 0; // Initialize counter for health lost during farm feeding interval
  feedingCountdowns[String(result.id)] = setInterval(async () => { // Set feeding countdown for the unit
    const unitToUpdate = await Unit.findByPk(result.id);
    if (unitToUpdate.health - healthLost <= 0) { // If the health reaches 0 trigger unit death
      await unitDeath(unitToUpdate.id, buildingId);
      removeInterval(unitToUpdate.id); // And remove and delete its feeding countdown
      delete feedAllUnitsIntervals[String(unitToUpdate.BuildingId)][String(unitToUpdate.id)]; // If the unit dies stop it's feeding countdown and delete her from the building feeding list
    } else {
      await Unit
        .update(
          { health: unitToUpdate.health - healthLost },
          { where: { id: unitToUpdate.id } },
        );
      feedAllUnitsIntervals[String(unitToUpdate.BuildingId)][String(unitToUpdate.id)] += healthLost; // Update health lost for each interval so it can regain half of it
      console.log(`Unit with id: ${unitToUpdate.id} lost ${healthLost} health`);
    }
  }, unitFeedingInterval);
  await changeNumberOfUnits(buildingId, 1); // Increment the number of units in corespondent building by 1
  res.status(StatusCodes.CREATED).json({ result });
});

const feedUnit = asyncWrapper(async (req, res, next) => { // PATCH feed unit with given id, add health to it and make it unfeedable for the set amount of miliseconds
  const { id: unitID } = req.params;
  const unit = await Unit.findByPk(unitID);
  if (!unit.feedable) {
    return next(createCustomError('This unit cannot be fed', StatusCodes.NOT_ACCEPTABLE));
  }
  const result = await Unit
    .update({ health: unit.health + manualFeedingGain, feedable: false }, { where: { id: unitID } }); // Update health and set feedable to false
  console.log(`Unit with id: ${unit.id} was manually fed and regained ${manualFeedingGain} health`);
  await timeout(unfeedableInterval); // Timeout for the given amount of seconds
  const result2 = await Unit
    .update({ feedable: true }, { where: { id: unitID } });
  res.status(StatusCodes.OK).json({ result, result2, success: true });
});

const deleteUnit = asyncWrapper(async (req, res, next) => { // DELETE a unit, stop it's feeding countdown and delete it from the array of intervals
  const { id: unitID } = req.params;

  const unit = await Unit.findByPk(unitID);
  if (unit.alive) {
    await changeNumberOfUnits(unit.BuildingId, -1); // Decrement the number of units in corespondent building by 1

    removeInterval(unitID); // Remove and delete the feeding countdown of this unit
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
