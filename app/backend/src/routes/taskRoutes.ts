import express from 'express';
import { protect } from '../middleware/protect.js';
import { createTaskLimiter } from '../middleware/rateLimiters.js';
import { createTask } from '../controllers/taskController.js';

const router = express.Router();

router.post('/', createTaskLimiter, protect, createTask);

export default router;
