const express = require('express');

const router = express.Router();

const {
  getAllUnits,
  getUnit,
  addUnitToBuilding,
  feedUnit,
  deleteUnit,
} = require('../controllers/units');

router.route('/').post(addUnitToBuilding).get(getAllUnits);
router.route('/:id').get(getUnit).patch(feedUnit).delete(deleteUnit);

module.exports = router;
