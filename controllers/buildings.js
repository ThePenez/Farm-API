/* eslint-disable consistent-return */
/* eslint-disable max-len */
import { StatusCodes } from 'http-status-codes';
import { createCustomError } from '../errors/custom-error.js';
import asyncWrapper from '../middleware/async-wrapper.js';
import Building from '../models/building.js';
import Unit from '../models/Unit.js';
import { buildingFeedingInterval, feedAllUnitsIntervals } from './config_values.js';

const getAllBuildings = asyncWrapper(async (req, res) => { // GET name, unit type and number of units for all buildings
  const buildings = await Building.findAll({ raw: true, attributes: ['name', 'unitType', 'numberOfUnits'] });
  console.log(buildings);
  res.status(StatusCodes.OK).json(buildings);
});

const getBuilding = asyncWrapper(async (req, res, next) => { // GET name, unit type, number of units of a building, along with id, health and aliveness for all the units in it
  const { id: buildingID } = req.params;
  const building = await Building.findByPk(buildingID, { attributes: ['name', 'unitType', 'numberOfUnits'], include: [{ model: Unit, as: 'units', attributes: ['id', 'health', 'alive'] }] });
  if (!building) {
    return next(createCustomError(`No building with id : ${buildingID}`, StatusCodes.NOT_FOUND));
  }
  res.status(StatusCodes.OK).json({ building });
});

const createBuilding = asyncWrapper(async (req, res) => { // POST create a building and set it's farm feeding interval to feed all of the units in it
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
  feedAllUnitsIntervals[String(result.id)].interval = setInterval(async () => { // Can be an individual function, Feed all alive units for half the health lost in previous interval
    const buildingToFeed = await Building.findByPk(result.id, { attributes: ['id', 'numberOfUnits'], include: [{ model: Unit, as: 'units', attributes: ['id', 'health', 'alive'] }] });
    let healthToRegain = 0;
    await Promise.all(buildingToFeed.units.map(async (unit) => { // Wait for all of the units health to be updated so other processes don't interfere
      if (unit.alive) {
        healthToRegain = Math.ceil(feedAllUnitsIntervals[String(buildingToFeed.id)][String(unit.id)] / 2); // Calculating how much health is to be regained
        console.log(`Unit with the id: ${unit.id} regained ${healthToRegain} health, fed by building with id: ${buildingToFeed.id}`);
        feedAllUnitsIntervals[String(buildingToFeed.id)][String(unit.id)] = 0; // Reset the counter of lost health for next farm feeding interval
        await Unit.update({ health: unit.health + healthToRegain }, { where: { id: unit.id } }); // Regain health
      }
    }));
  }, buildingFeedingInterval);
  res.status(StatusCodes.CREATED).json(result);
});

const deleteBuilding = asyncWrapper(async (req, res, next) => { // DELETE a building, stop its farm feeding interval and remove it from the array
  const { id: buildingID } = req.params;
  clearInterval(feedAllUnitsIntervals[String(buildingID)].interval); // Stop the farm feeding interval
  delete feedAllUnitsIntervals[String(buildingID)]; // Remove it from the array
  const result = await Building.destroy({ where: { id: buildingID } });
  if (!result) {
    return next(createCustomError(`No building with id : ${buildingID}`, StatusCodes.NOT_FOUND));
  }
  res.status(StatusCodes.OK).json({ result });
});

export {
  getAllBuildings,
  getBuilding,
  createBuilding,
  deleteBuilding,
};
