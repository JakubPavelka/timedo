import express from 'express';
import { protect } from '../middleware/protect.js';
import {
    createProject,
    deleteProject,
    getProjects,
    getProjectsWithTasks,
    updateProject,
} from '../controllers/projectController.js';
import {
    createProjectLimiter,
    deleteProjectLimiter,
    readProjectsLimiter,
    updateProjectLimiter,
} from '../middleware/rateLimiters.js';

const router = express.Router();

router.post('/', createProjectLimiter, protect, createProject);
router.get('/', readProjectsLimiter, protect, getProjects);
router.patch('/', updateProjectLimiter, protect, updateProject);
router.delete('/', deleteProjectLimiter, protect, deleteProject);
router.get('/with-tasks', readProjectsLimiter, protect, getProjectsWithTasks);

export default router;
