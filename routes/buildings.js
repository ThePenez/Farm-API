const express = require('express');

const router = express.Router();

const {
  getAllBuildings,
  getBuilding,
  createBuilding,
  updateBuilding,
  deleteBuilding,
} = require('../controllers/buildings');

router.route('/').post(createBuilding).get(getAllBuildings);
router.route('/:id').get(getBuilding).patch(updateBuilding).delete(deleteBuilding);

module.exports = router;
