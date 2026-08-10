import express from 'express';
import { protect } from '../middleware/protect.js';
import {
    createTaskLimiter,
    readTasksLimiter,
    readTaskLimiter,
    updateTaskLimiter,
} from '../middleware/rateLimiters.js';
import {
    createTask,
    getTask,
    getTasks,
    updateTask,
} from '../controllers/taskController.js';

const router = express.Router();

router.post('/', createTaskLimiter, protect, createTask);
router.get('/', readTasksLimiter, protect, getTasks);
router.get('/:task', readTaskLimiter, protect, getTask);
router.patch('/:task', updateTaskLimiter, protect, updateTask);

export default router;
