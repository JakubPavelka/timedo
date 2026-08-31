import express from 'express';
import {
    createTaskChecklistLimiter,
    deleteTaskChecklistLimiter,
    updateTaskChecklistLimiter,
    readTaskChecklistLimiter,
} from '../middleware/rateLimiters.js';
import {
    createTaskChecklist,
    deleteTaskChecklist,
    updateTaskChecklist,
    getTasksChecklist,
} from '../controllers/taskChecklistController.js';
import { protect } from '../middleware/protect.js';

const router = express.Router();

router.post('/', createTaskChecklistLimiter, protect, createTaskChecklist);
router.get('/', readTaskChecklistLimiter, protect, getTasksChecklist);
router.delete('/', deleteTaskChecklistLimiter, protect, deleteTaskChecklist);
router.patch('/', updateTaskChecklistLimiter, protect, updateTaskChecklist);

export default router;
