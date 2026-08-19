import express from 'express';
import { protect } from '../middleware/protect.js';
import {
    createTaskLimiter,
    readTasksLimiter,
    readTaskLimiter,
    updateTaskLimiter,
    deleteTaskLimiter,
    deleteTasksLimiter,
    updateTasksLimiter,
} from '../middleware/rateLimiters.js';
import {
    createTask,
    getTask,
    getTasks,
    updateTask,
    deleteTask,
    deleteTasks,
    updateTasks,
} from '../controllers/taskController.js';

const router = express.Router();

router.post('/', createTaskLimiter, protect, createTask);
router.get('/', readTasksLimiter, protect, getTasks);
router.get('/:task', readTaskLimiter, protect, getTask);
router.patch('/:task', updateTaskLimiter, protect, updateTask);
router.patch('/', updateTasksLimiter, protect, updateTasks);
router.delete('/:task', deleteTaskLimiter, protect, deleteTask);
router.delete('/', deleteTasksLimiter, protect, deleteTasks);

export default router;
