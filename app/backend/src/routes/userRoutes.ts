import express from 'express';
import { protect } from '../middleware/protect.js';
import { deleteUser } from '../controllers/userController.js';
import { deleteMeLimiter } from '../middleware/rateLimiters.js';

const router = express.Router();

router.delete('/me', deleteMeLimiter, protect, deleteUser);

export default router;
