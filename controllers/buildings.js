/* eslint-disable consistent-return */
/* eslint-disable max-len */
const { StatusCodes } = require('http-status-codes');
const { validationResult } = require('express-validator');
const { createCustomError } = require('../errors/custom-error');
const asyncWrapper = require('../middleware/async-wrapper');
const { Building, Unit } = require('../models');
const { feedAllUnitsIntervals } = require('./config_values');
const {
  setBuildingIntervals,
} = require('../middleware/helper');

const getAllBuildings = asyncWrapper(async (req, res) => { // GET name, unit type and number of units for all buildings
  const buildings = await Building.findAll({ raw: true, attributes: ['name', 'unitType', 'numberOfUnits'] });
  console.log(buildings);
  res.status(StatusCodes.OK).json(buildings);
});

const getBuilding = asyncWrapper(async (req, res, next) => { // GET name, unit type, number of units of a building, along with id, health and aliveness for all the units in it
  const { id: buildingID } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
  }
  const building = await Building.findByPk(buildingID, { attributes: ['name', 'unitType', 'numberOfUnits'], include: [{ model: Unit, as: 'units', attributes: ['id', 'health', 'alive'] }] });
  if (!building) {
    return next(createCustomError(`No building with id : ${buildingID}`, StatusCodes.NOT_FOUND));
  }
  res.status(StatusCodes.OK).json({ building });
});

const createBuilding = asyncWrapper(async (req, res) => { // POST create a building and set it's farm feeding interval to feed all of the units in it
  const { name, unitType } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
  }
  const building = {
    name,
    unitType,
    numberOfUnits: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await Building.create(building);
  await setBuildingIntervals(result.id);
  res.status(StatusCodes.CREATED).json(result);
});

const deleteBuilding = asyncWrapper(async (req, res, next) => { // DELETE a building, stop its farm feeding interval and remove it from the array
  const { id: buildingID } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
  }
  clearInterval(feedAllUnitsIntervals[String(buildingID)].interval); // Stop the farm feeding interval
  delete feedAllUnitsIntervals[String(buildingID)]; // Remove it from the array
  const result = await Building.destroy({ where: { id: buildingID } });
  if (!result) {
    return next(createCustomError(`No building with id : ${buildingID}`, StatusCodes.NOT_FOUND));
  }
  res.status(StatusCodes.OK).json({ result });
});

module.exports = {
  getAllBuildings,
  getBuilding,
  createBuilding,
  deleteBuilding,
};
