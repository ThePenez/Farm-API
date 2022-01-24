const { StatusCodes } = require('http-status-codes');
const { createCustomError } = require('../errors/custom-error');
const asyncWrapper = require('../middleware/async-wrapper')
const { Building } = require('../models');

const getAllBuildings = asyncWrapper(async (req, res) => {
  const buildings = await Building.findAll({ raw: true, attributes: ['name', 'unitType', 'numberOfUnits'] });
  console.log(buildings);
  res.status(StatusCodes.OK).json(buildings);
});

const getBuilding = asyncWrapper(async (req, res) => {
  res.send('get building');
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

  const result = Building.create(building);
  res.status(StatusCodes.CREATEDK).json(result);
});

const updateBuilding = asyncWrapper(async (req, res) => {
  res.send('update building');
});

const deleteBuilding = asyncWrapper(async (req, res, next) => {
  const { id: buildingID } = req.params;
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
