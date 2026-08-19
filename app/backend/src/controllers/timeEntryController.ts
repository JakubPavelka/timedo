import { Request, Response } from 'express';
import { prisma } from '../db/db.js';
import { Prisma } from '../generated/prisma/client.js';
import { TimeEntrySchema } from '@timedo/shared/src/schemas/timeEntrySchema.js';

const startTimeEntry = async (req: Request, res: Response) => {
    const parsedBody = TimeEntrySchema.safeParse(req.body);

    if (!parsedBody.success) {
        return res.status(400).json({
            message: 'Invalid input',
            code: 'VALIDATION_ERROR',
        });
    }
    const { taskId, description } = parsedBody.data;

    try {
        if (taskId) {
            const task = await prisma.task.findUnique({
                where: { id: taskId, userId: req.user!.id },
                select: { id: true },
            });

            if (!task) {
                return res
                    .status(404)
                    .json({ message: 'Task not found', code: 'TASK_NOT_FOUND' });
            }
        }

        const timeEntry = await prisma.timeEntry.create({
            data: {
                userId: req.user!.id,
                taskId,
                description,
                startedAt: new Date(),
            },
        });

        return res.status(201).json({ status: 'success', data: timeEntry });
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
            return res.status(409).json({
                message: 'A timer is already running',
                code: 'TIMER_ALREADY_RUNNING',
            });
        }
        return res.status(500).json({ message: 'Failed to start timer' });
    }
};

export { startTimeEntry };
