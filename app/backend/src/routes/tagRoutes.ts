import express from 'express';
import { createTag, getTags } from '../controllers/tagController.js';
import { createTagLimiter, readTagLimiter } from '../middleware/rateLimiters.js';
import { protect } from '../middleware/protect.js';

const router = express.Router();

router.post('/', createTagLimiter, protect, createTag);
router.get('/', readTagLimiter, protect, getTags);

export default router;
