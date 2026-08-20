import express from 'express';
import { protect } from '../middleware/protect.js';
import { createTimeEntryLimiter, stopTimeEntryLimiter } from '../middleware/rateLimiters.js';
import { startTimeEntry, stopTimeEntry } from '../controllers/timeEntryController.js';

const router = express.Router();

router.post('/start', createTimeEntryLimiter, protect, startTimeEntry);
router.post('/stop', stopTimeEntryLimiter, protect, stopTimeEntry);

export default router;
