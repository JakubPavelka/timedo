import express from 'express';
import {
    createTag,
    deleteTag,
    getTags,
    getTagsWithTasks,
    updateTag,
} from '../controllers/tagController.js';
import {
    createTagLimiter,
    deleteTagLimiter,
    readTagLimiter,
    updateTagLimiter,
} from '../middleware/rateLimiters.js';
import { protect } from '../middleware/protect.js';

const router = express.Router();

router.post('/', createTagLimiter, protect, createTag);
router.get('/', readTagLimiter, protect, getTags);
router.patch('/', updateTagLimiter, protect, updateTag);
router.delete('/', deleteTagLimiter, protect, deleteTag);
router.get('/with-tasks', readTagLimiter, protect, getTagsWithTasks);

export default router;
