import express from 'express';
import { protect } from '../middleware/protect.js';
import {
    createTimeEntryLimiter,
    stopTimeEntryLimiter,
    readActiveTimeEntryLimiter,
    readTimeEntriesLimiter,
    deleteTimeEntryLimiter,
} from '../middleware/rateLimiters.js';
import {
    startTimeEntry,
    stopTimeEntry,
    getActiveTimeEntry,
    getTimeEntries,
    deleteTimeEntry,
} from '../controllers/timeEntryController.js';

const router = express.Router();

router.post('/start', createTimeEntryLimiter, protect, startTimeEntry);
router.post('/stop', stopTimeEntryLimiter, protect, stopTimeEntry);
router.get('/active', readActiveTimeEntryLimiter, protect, getActiveTimeEntry);
router.get('/entries', readTimeEntriesLimiter, protect, getTimeEntries);
router.delete('/', deleteTimeEntryLimiter, protect, deleteTimeEntry);

export default router;
