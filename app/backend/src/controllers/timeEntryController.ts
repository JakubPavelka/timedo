import { Request, Response } from 'express';
import { prisma } from '../db/db.js';
import { Prisma } from '../generated/prisma/client.js';
import { EntryType, TimeEntrySchema } from '@timedo/shared/src/schemas/timeEntrySchema.js';

const startTimeEntry = async (req: Request, res: Response) => {
    const parsedBody = TimeEntrySchema.safeParse(req.body);

    if (!parsedBody.success) {
        return res.status(400).json({
            message: 'Invalid input',
            code: 'VALIDATION_ERROR',
        });
    }
    const { taskId, description, type, plannedDuration } = parsedBody.data;

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

        const timeEntry = await prisma.$transaction(async (tx) => {
            const runningEntry = await tx.timeEntry.findFirst({
                where: { userId: req.user!.id, endedAt: null },
            });

            if (runningEntry) {
                const isExpiredPomodoro =
                    runningEntry.type === EntryType.POMODORO &&
                    runningEntry.plannedDuration !== null &&
                    runningEntry.startedAt.getTime() + runningEntry.plannedDuration * 1000 <=
                        Date.now();

                if (!isExpiredPomodoro) {
                    return null;
                }

                await tx.timeEntry.update({
                    where: { id: runningEntry.id },
                    data: {
                        endedAt: new Date(
                            runningEntry.startedAt.getTime() +
                                runningEntry.plannedDuration! * 1000,
                        ),
                        duration: runningEntry.plannedDuration,
                    },
                });
            }

            return tx.timeEntry.create({
                data: {
                    userId: req.user!.id,
                    taskId,
                    description,
                    type,
                    plannedDuration,
                    startedAt: new Date(),
                },
            });
        });

        if (!timeEntry) {
            return res.status(409).json({
                message: 'A timer is already running',
                code: 'TIMER_ALREADY_RUNNING',
            });
        }

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
