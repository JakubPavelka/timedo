import express from 'express';
import { protect } from '../middleware/protect.js';
import {
    createTaskLimiter,
    readTasksLimiter,
    readTaskLimiter,
} from '../middleware/rateLimiters.js';
import { createTask, getTask, getTasks } from '../controllers/taskController.js';

const router = express.Router();

router.post('/', createTaskLimiter, protect, createTask);
router.get('/', readTasksLimiter, protect, getTasks);
router.get('/:task', readTaskLimiter, protect, getTask);

export default router;
