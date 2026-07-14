import express from 'express';
import {
    login,
    logout,
    register,
    refresh,
    me,
    updateMe,
} from '../controllers/authController.js';
import { protect } from '../middleware/protect.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refresh);
router.get('/me', protect, me);
router.put('/me', protect, updateMe);

export default router;
