const express = require('express');

const router = express.Router();

const {
  getAllUnits,
  getUnit,
  addUnitToStable,
  updateUnit,
  deleteUnit,
} = require('../controllers/units');

router.route('/').post(addUnitToStable).get(getAllUnits);
router.route('/:id').get(getUnit).patch(updateUnit).delete(deleteUnit);

module.exports = router;
