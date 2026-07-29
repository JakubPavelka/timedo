import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';
import { disconnectDB } from './db/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import tagRoutes from './routes/tagRoutes.js';
import linkRoutes from './routes/linkRoutes.js';

const PORT = 3001;

dotenv.config();

const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/task', taskRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/tag', tagRoutes);
app.use('/api/link', linkRoutes);

app.get('/', (req, res) => {
    res.send('Hello world');
});

const server = app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});

// Handle unhandled promise rejections (e.g., database connection errors)
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection: ', err);
    server.close(async () => {
        await disconnectDB();
        process.exit(1);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', async (err) => {
    console.error('Uncaught Exception: ', err);
    await disconnectDB();
    process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', async (err) => {
    console.error('SIGTERM received, shutting down gracefully', err);
    server.close(async () => {
        await disconnectDB();
        process.exit(0);
    });
});
