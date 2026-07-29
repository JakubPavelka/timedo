import express from 'express';
import { protect } from '../middleware/protect.js';
import { createLink, deleteLink } from '../controllers/linkController.js';
import { createLinkLimiter, deleteLinkLimiter } from '../middleware/rateLimiters.js';

const router = express.Router();

router.post('/', createLinkLimiter, protect, createLink);
router.delete('/', deleteLinkLimiter, protect, deleteLink);

export default router;
