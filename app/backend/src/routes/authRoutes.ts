import express from 'express';
import {
    login,
    logout,
    register,
    refresh,
    me,
    updateMe,
    changePassword,
    resetPassword,
    forgottenPassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/protect.js';
import {
    registerLimiter,
    loginLimiter,
    meGetLimiter,
    mePutLimiter,
    logoutLimiter,
    refreshLimiter,
    changePasswordLimiter,
    forgottenPasswordLimiter,
    resetPasswordLimiter,
} from '../middleware/rateLimiters.js';

const router = express.Router();

router.post('/register', registerLimiter, register);
router.post('/login', loginLimiter, login);
router.post('/logout', logoutLimiter, logout);
router.post('/refresh', refreshLimiter, refresh);
router.get('/me', meGetLimiter, protect, me);
router.put('/me', mePutLimiter, protect, updateMe);
router.put('/me/password', changePasswordLimiter, protect, changePassword);
router.post('/forgotten-password', forgottenPasswordLimiter, forgottenPassword);
router.post('/reset-password', resetPasswordLimiter, resetPassword);

export default router;
