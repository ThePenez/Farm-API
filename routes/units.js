const express = require('express');

const router = express.Router();

const {
  getAllUnits,
  getUnit,
  createUnit,
  updateUnit,
  deleteUnit,
} = require('../controllers/units');

router.route('/').post(createUnit).get(getAllUnits);
router.route('/:id').get(getUnit).patch(updateUnit).delete(deleteUnit);

module.exports = router;
