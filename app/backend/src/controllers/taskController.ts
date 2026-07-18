import { Request, Response } from 'express';
import { prisma } from '../db/db.js';
import { TaskSchema } from '@timedo/shared/src/schemas/taskSchema.js';

const createTask = async (req: Request, res: Response) => {
    const parsedBody = TaskSchema.safeParse(req.body);

    if (!parsedBody.success) {
        return res.status(400).json({
            message: 'Invalid input',
            code: 'VALIDATION_ERROR',
        });
    }

    const { title, description, priority, projectId, status } = parsedBody.data;

    try {
        const createdTask = await prisma.task.create({
            data: {
                title,
                description,
                priority,
                status,
                projectId: projectId ?? undefined,
                userId: req.user!.id,
            },
        });

        return res.status(201).json({
            status: 'success',
            data: { task: createdTask },
        });
    } catch {
        return res.status(500).json({ message: 'Failed to create task' });
    }
};

export { createTask };
