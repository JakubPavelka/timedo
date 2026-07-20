import express from 'express';
import { protect } from '../middleware/protect.js';
import { createProject } from '../controllers/projectController.js';

const router = express.Router();

router.post('/', protect, createProject);

export default router;
