/* eslint-disable max-len */
const { StatusCodes } = require('http-status-codes');
const { createCustomError } = require('../errors/custom-error');
const asyncWrapper = require('../middleware/async-wrapper');
const { Building, Unit } = require('../models');
const { buildingFeedingInterval, feedAllUnitsIntervals } = require('./config_values');

const getAllBuildings = asyncWrapper(async (req, res) => {
  const buildings = await Building.findAll({ raw: true, attributes: ['name', 'unitType', 'numberOfUnits'] });
  console.log(buildings);
  res.status(StatusCodes.OK).json(buildings);
});

// eslint-disable-next-line consistent-return
const getBuilding = asyncWrapper(async (req, res, next) => {
  const { id: buildingID } = req.params;
  const building = await Building.findByPk(buildingID, { attributes: ['name', 'unitType', 'numberOfUnits'], include: [{ model: Unit, as: 'units', attributes: ['id', 'health', 'alive'] }] });
  if (!building) {
    return next(createCustomError(`No building with id : ${buildingID}`, 404));
  }
  res.status(200).json({ building });
});

const createBuilding = asyncWrapper(async (req, res) => {
  const { name, unitType } = req.body;
  const building = {
    name,
    unitType,
    numberOfUnits: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await Building.create(building);
  feedAllUnitsIntervals[String(result.id)] = {};
  feedAllUnitsIntervals[String(result.id)].interval = setInterval(async () => { // Feed all alive units for half the health lost in previous interval
    const buildingToFeed = await Building.findByPk(result.id, { attributes: ['id', 'numberOfUnits'], include: [{ model: Unit, as: 'units', attributes: ['id', 'health', 'alive'] }] });
    let healthToRegain = 0;
    await Promise.all(buildingToFeed.units.map(async (unit) => { // Wait for all of the units health to be updated so other processes don't interfere
      if (unit.alive) {
        healthToRegain = Math.ceil(feedAllUnitsIntervals[String(buildingToFeed.id)][String(unit.id)] / 2); // Calculating how much health is to be regained
        console.log(`Unit with the id: ${unit.id} regained ${healthToRegain} health, fed by building with id: ${buildingToFeed.id}`);
        feedAllUnitsIntervals[String(buildingToFeed.id)][String(unit.id)] = 0; // Reset for next farm feeding interval
        await Unit.update({ health: unit.health + healthToRegain }, { where: { id: unit.id } }); // Regain health
      }
    }));
  }, buildingFeedingInterval);
  res.status(StatusCodes.CREATED).json(result);
});

// eslint-disable-next-line consistent-return
const deleteBuilding = asyncWrapper(async (req, res, next) => { // ***NEEDS TO CLEAR INTERVAL***
  const { id: buildingID } = req.params;
  clearInterval(feedAllUnitsIntervals[String(buildingID)].interval);
  delete feedAllUnitsIntervals[String(buildingID)];
  const result = await Building.destroy({ where: { id: buildingID } });
  if (!result) {
    return next(createCustomError(`No building with id : ${buildingID}`, 404));
  }
  res.status(200).json({ result });
});

module.exports = {
  getAllBuildings,
  getBuilding,
  createBuilding,
  deleteBuilding,
};
