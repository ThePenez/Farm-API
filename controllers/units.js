const { StatusCodes } = require('http-status-codes');
const { createCustomError } = require('../errors/custom-error');
const asyncWrapper = require('../middleware/async-wrapper');
const { Building, Unit } = require('../models');

const getAllUnits = async (req, res) => {
  res.send('get all units');
};

// eslint-disable-next-line consistent-return
const getUnit = asyncWrapper(async (req, res, next) => {
  const { id: unitID } = req.params;
  const unit = await Unit.findByPk(unitID);
  if (!unit) {
    return next(createCustomError(`No unit with id : ${unitID}`, 404));
  }
  res.status(200).json({ unit });
});

const createUnit = async (req, res) => {
  res.send('create unit');
};

const updateUnit = async (req, res) => {
  res.send('update unit');
};

const deleteUnit = async (req, res) => {
  res.send('delete unit');
};

module.exports = {
  getAllUnits,
  getUnit,
  createUnit,
  updateUnit,
  deleteUnit,
};
