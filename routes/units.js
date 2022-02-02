import express from 'express';

import {
  getAllUnits,
  getUnit,
  addUnitToBuilding,
  feedUnit,
  deleteUnit,
} from '../controllers/units.js';

const router = express.Router();

router.route('/').post(addUnitToBuilding).get(getAllUnits);
router.route('/:id').get(getUnit).patch(feedUnit).delete(deleteUnit);

export default router;
