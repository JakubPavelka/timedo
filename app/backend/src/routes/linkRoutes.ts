import express from 'express';
import { protect } from '../middleware/protect.js';
import {
    createLink,
    deleteLink,
    getLinks,
    updateLink,
} from '../controllers/linkController.js';
import {
    createLinkLimiter,
    deleteLinkLimiter,
    readLinkLimiter,
    updateLinkLimiter,
} from '../middleware/rateLimiters.js';

const router = express.Router();

router.post('/', createLinkLimiter, protect, createLink);
router.get('/:taskId', readLinkLimiter, protect, getLinks);
router.delete('/', deleteLinkLimiter, protect, deleteLink);
router.put('/', updateLinkLimiter, protect, updateLink);

export default router;
