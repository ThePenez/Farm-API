const { StatusCodes } = require('http-status-codes');
const { Building } = require('../models');

const getAllBuildings = async (req, res) => {
  const buildings = await Building.findAll({ raw: true, attributes: ['name', 'unitType', 'numberOfUnits'] });
  console.log(buildings);
  res.status(StatusCodes.OK).json(buildings);
};

const getBuilding = async (req, res) => {
  res.send('get building');
};

const createBuilding = async (req, res) => {
  res.send('create building');
};

const updateBuilding = async (req, res) => {
  res.send('update building');
};

const deleteBuilding = async (req, res) => {
  res.send('delete building');
};

module.exports = {
  getAllBuildings,
  getBuilding,
  createBuilding,
  updateBuilding,
  deleteBuilding,
};
