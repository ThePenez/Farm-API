const express = require('express');

const router = express.Router();

const {
  getAllUnits,
  getUnit,
  addUnitToStable,
  feedUnit,
  deleteUnit,
} = require('../controllers/units');

router.route('/').post(addUnitToStable).get(getAllUnits);
router.route('/:id').get(getUnit).patch(feedUnit).delete(deleteUnit);

module.exports = router;
