const express = require('express');
const { body, param } = require('express-validator');

const router = express.Router();

const {
  getAllUnits,
  getUnit,
  addUnitToBuilding,
  feedUnit,
  deleteUnit,
} = require('../controllers/units');

router.get('/', getAllUnits);
router.post('/', body('type').isIn(['Pig', 'Horse', 'Pony', 'Donkey', 'Chicken', 'Goat', 'Duck']), body('buildingId').isInt(), addUnitToBuilding);
router.get('/:id', param('id').isInt(), getUnit);
router.patch('/:id', param('id').isInt(), feedUnit);
router.delete('/:id', param('id').isInt(), deleteUnit);

module.exports = router;
