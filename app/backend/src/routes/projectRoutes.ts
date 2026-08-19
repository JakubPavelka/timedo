import express from 'express';
import { protect } from '../middleware/protect.js';
import {
    createProject,
    getProjects,
} from '../controllers/projectController.js';
import {
    createProjectLimiter,
    readProjectsLimiter,
} from '../middleware/rateLimiters.js';

const router = express.Router();

router.post('/', createProjectLimiter, protect, createProject);
router.get('/', readProjectsLimiter, protect, getProjects);

export default router;
