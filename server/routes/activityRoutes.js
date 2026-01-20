import express from 'express';
import { getActivities, createActivity, enrollActivity } from '../controllers/activityController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getActivities);
router.post('/', protect, adminOnly, createActivity);
router.post('/:id/enroll', protect, enrollActivity);

export default router;
