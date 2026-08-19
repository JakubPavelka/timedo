import express from 'express';
import { protect } from '../middleware/protect.js';
import { createTimeEntryLimiter } from '../middleware/rateLimiters.js';
import { startTimeEntry } from '../controllers/timeEntryController.js';

const router = express.Router();

router.post('/start', createTimeEntryLimiter, protect, startTimeEntry);

export default router;
