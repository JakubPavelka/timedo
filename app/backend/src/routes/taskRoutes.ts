import express from 'express';
import { protect } from '../middleware/protect.js';
import { createTaskLimiter, readTasksLimiter } from '../middleware/rateLimiters.js';
import { createTask, getTasks } from '../controllers/taskController.js';

const router = express.Router();

router.post('/', createTaskLimiter, protect, createTask);
router.get('/', readTasksLimiter, protect, getTasks);

export default router;
