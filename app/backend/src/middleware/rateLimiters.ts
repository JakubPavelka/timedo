import { rateLimit } from 'express-rate-limit';

const commonOptions = {
    standardHeaders: 'draft-8' as const,
    legacyHeaders: false,
    ipv6Subnet: 56,
    message: {
        message: 'Too many requests, please try again later',
        code: 'RATE_LIMITED',
    },
};

export const registerLimiter = rateLimit({
    ...commonOptions,
    windowMs: 60 * 60 * 1000, // 1h
    limit: 5,
});

export const loginLimiter = rateLimit({
    ...commonOptions,
    windowMs: 15 * 60 * 1000, // 15min
    limit: 20,
});

export const meGetLimiter = rateLimit({
    ...commonOptions,
    windowMs: 15 * 60 * 1000, // 15min
    limit: 100,
});

export const mePutLimiter = rateLimit({
    ...commonOptions,
    windowMs: 15 * 60 * 1000, // 15min
    limit: 10,
});

export const logoutLimiter = rateLimit({
    ...commonOptions,
    windowMs: 15 * 60 * 1000, // 15min
    limit: 20,
});

export const refreshLimiter = rateLimit({
    ...commonOptions,
    windowMs: 15 * 60 * 1000, // 15min
    limit: 60,
});

export const deleteMeLimiter = rateLimit({
    ...commonOptions,
    windowMs: 60 * 60 * 1000, // 1h
    limit: 5,
});

export const createTaskLimiter = rateLimit({
    ...commonOptions,
    windowMs: 15 * 60 * 1000, // 15min
    limit: 30,
});

export const readTasksLimiter = rateLimit({
    ...commonOptions,
    windowMs: 15 * 60 * 1000, // 15min
    limit: 300,
});

export const readTaskLimiter = rateLimit({
    ...commonOptions,
    windowMs: 15 * 60 * 1000, // 15min
    limit: 300,
});

export const updateTaskLimiter = rateLimit({
    ...commonOptions,
    windowMs: 15 * 60 * 1000, // 15min
    limit: 100,
});

export const deleteTaskLimiter = rateLimit({
    ...commonOptions,
    windowMs: 15 * 60 * 1000, // 15min
    limit: 30,
});

export const deleteTasksLimiter = rateLimit({
    ...commonOptions,
    windowMs: 15 * 60 * 1000, // 15min
    limit: 30,
});

export const createProjectLimiter = rateLimit({
    ...commonOptions,
    windowMs: 15 * 60 * 1000, // 15min
    limit: 30,
});

export const readProjectsLimiter = rateLimit({
    ...commonOptions,
    windowMs: 15 * 60 * 1000, // 15min
    limit: 200,
});

export const createTagLimiter = rateLimit({
    ...commonOptions,
    windowMs: 15 * 60 * 1000, // 15min
    limit: 30,
});

export const readTagLimiter = rateLimit({
    ...commonOptions,
    windowMs: 15 * 60 * 1000, // 15min
    limit: 100,
});

export const createLinkLimiter = rateLimit({
    ...commonOptions,
    windowMs: 15 * 60 * 1000, // 15min
    limit: 25,
});

export const readLinkLimiter = rateLimit({
    ...commonOptions,
    windowMs: 15 * 60 * 1000, // 15min
    limit: 100,
});

export const deleteLinkLimiter = rateLimit({
    ...commonOptions,
    windowMs: 15 * 60 * 1000, // 15min
    limit: 15,
});

export const updateLinkLimiter = rateLimit({
    ...commonOptions,
    windowMs: 15 * 60 * 1000, // 15min
    limit: 15,
});
