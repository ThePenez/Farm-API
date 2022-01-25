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
  feedAllUnitsIntervals[String(result.id)] = setInterval(() => {
    console.log(`Feed all ALIVE units in building with id: ${result.id}`);
  }, buildingFeedingInterval);
  res.status(StatusCodes.CREATED).json(result);
});

const updateBuilding = asyncWrapper(async (req, res) => {
  res.send('update building');
});

// eslint-disable-next-line consistent-return
const deleteBuilding = asyncWrapper(async (req, res, next) => { // ***NEEDS TO CLEAR INTERVAL***
  const { id: buildingID } = req.params;
  clearInterval(feedAllUnitsIntervals[String(buildingID)]);
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
  updateBuilding,
  deleteBuilding,
};
