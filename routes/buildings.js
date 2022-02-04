const express = require('express');
const { body, param } = require('express-validator');

const router = express.Router();

const {
  getAllBuildings,
  getBuilding,
  createBuilding,
  deleteBuilding,
} = require('../controllers/buildings');

router.get('/', getAllBuildings);
router.post('/', body('name').isIn(['Barn', 'Stable', 'Brooder house', 'Shed']), body('unitType').isIn(['Pig', 'Horse', 'Pony', 'Donkey', 'Chicken', 'Goat', 'Duck']), createBuilding);
router.get('/:id', param('id').isInt(), getBuilding);
router.delete('/:id', param('id').isInt(), deleteBuilding);

module.exports = router;
