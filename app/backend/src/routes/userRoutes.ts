import express from 'express';
import { protect } from '../middleware/protect.js';
import { deleteUser } from '../controllers/userController.js';

const router = express.Router();

router.delete('/me', protect, deleteUser);

export default router;
