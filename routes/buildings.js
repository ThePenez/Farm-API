import express from 'express';

import {
  getAllBuildings,
  getBuilding,
  createBuilding,
  deleteBuilding,
} from '../controllers/buildings.js';

const router = express.Router();

router.route('/').post(createBuilding).get(getAllBuildings);
router.route('/:id').get(getBuilding).delete(deleteBuilding);

export default router;
