import express from 'express';
import { protect } from '../middleware/protect.js';
import {
    createTimeEntryLimiter,
    stopTimeEntryLimiter,
    readActiveTimeEntryLimiter,
} from '../middleware/rateLimiters.js';
import {
    startTimeEntry,
    stopTimeEntry,
    getActiveTimeEntry,
} from '../controllers/timeEntryController.js';

const router = express.Router();

router.post('/start', createTimeEntryLimiter, protect, startTimeEntry);
router.post('/stop', stopTimeEntryLimiter, protect, stopTimeEntry);
router.get('/active', readActiveTimeEntryLimiter, protect, getActiveTimeEntry);

export default router;
