import express from 'express';
import { protect } from '../middleware/protect.js';
import { createLink } from '../controllers/linkController.js';
import { createLinkLimiter } from '../middleware/rateLimiters';

const router = express.Router();

router.post('/', createLinkLimiter, protect, createLink);

export default router;
