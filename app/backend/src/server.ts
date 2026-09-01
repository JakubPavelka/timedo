import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';
import { disconnectDB } from './db/db.js';
import { logger } from './lib/logger.js';
import { pinoHttp } from 'pino-http';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import tagRoutes from './routes/tagRoutes.js';
import linkRoutes from './routes/linkRoutes.js';
import timeEntryRoutes from './routes/timeEntryRoutes.js';
import taskChecklistRoutes from './routes/taskChecklistRoutes.js';

const PORT = 3001;

dotenv.config();

const app = express();

app.set('query parser', 'extended');

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);
app.use(helmet());
app.use(
    pinoHttp({
        logger,
        redact: ['req.headers.cookie', 'req.headers.authorization'],
    })
);
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/task', taskRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/tag', tagRoutes);
app.use('/api/link', linkRoutes);
app.use('/api/time-entry', timeEntryRoutes);
app.use('/api/task-checklist', taskChecklistRoutes);

app.get('/', (req, res) => {
    res.send('Hello world');
});

const server = app.listen(PORT, () => {
    logger.info(`Server is running on port: ${PORT}`);
});

// Handle unhandled promise rejections (e.g., database connection errors)
process.on('unhandledRejection', (err) => {
    logger.error(err, 'Unhandled Rejection');
    server.close(async () => {
        await disconnectDB();
        process.exit(1);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', async (err) => {
    logger.error(err, 'Uncaught Exception');
    await disconnectDB();
    process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', async (signal) => {
    logger.info({ signal }, 'SIGTERM received, shutting down gracefully');
    server.close(async () => {
        await disconnectDB();
        process.exit(0);
    });
});
