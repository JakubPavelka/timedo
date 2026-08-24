import { Request, Response } from 'express';
import { prisma } from '../db/db.js';
import { Prisma, TimeEntry } from '../generated/prisma/client.js';
import {
    EntryType,
    TimeEntrySchema,
    DeleteTimeEntrySchema,
} from '@timedo/shared/src/schemas/timeEntrySchema.js';

const isExpiredPomodoro = (entry: TimeEntry) =>
    entry.type === EntryType.POMODORO &&
    entry.plannedDuration !== null &&
    entry.startedAt.getTime() + entry.plannedDuration * 1000 <= Date.now();

const computeStopValues = (entry: TimeEntry) => {
    if (isExpiredPomodoro(entry)) {
        return {
            endedAt: new Date(entry.startedAt.getTime() + entry.plannedDuration! * 1000),
            duration: entry.plannedDuration!,
        };
    }

    const endedAt = new Date();
    const duration = Math.floor((endedAt.getTime() - entry.startedAt.getTime()) / 1000);
    return { endedAt, duration };
};

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
                if (!isExpiredPomodoro(runningEntry)) {
                    return null;
                }

                const { endedAt, duration } = computeStopValues(runningEntry);

                await tx.timeEntry.update({
                    where: { id: runningEntry.id },
                    data: { endedAt, duration },
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

const getActiveTimeEntry = async (req: Request, res: Response) => {
    try {
        const runningEntry = await prisma.timeEntry.findFirst({
            where: { userId: req.user!.id, endedAt: null },
        });

        if (runningEntry && isExpiredPomodoro(runningEntry)) {
            const { endedAt, duration } = computeStopValues(runningEntry);
            await prisma.timeEntry.update({
                where: { id: runningEntry.id },
                data: { endedAt, duration },
            });
            return res.status(200).json({ status: 'success', data: null });
        }

        return res.status(200).json({ status: 'success', data: runningEntry });
    } catch {
        return res.status(500).json({ message: 'Failed to fetch active timer' });
    }
};

const stopTimeEntry = async (req: Request, res: Response) => {
    try {
        const runningEntry = await prisma.timeEntry.findFirst({
            where: { userId: req.user!.id, endedAt: null },
        });

        if (!runningEntry) {
            return res.status(404).json({
                message: 'No timer is running',
                code: 'NO_RUNNING_TIMER',
            });
        }

        const { endedAt, duration } = computeStopValues(runningEntry);

        const timeEntry = await prisma.timeEntry.update({
            where: { id: runningEntry.id },
            data: { endedAt, duration },
        });

        let workedTime: number | undefined;
        if (timeEntry.taskId) {
            const timeAggregate = await prisma.timeEntry.aggregate({
                where: { taskId: timeEntry.taskId, userId: req.user!.id },
                _sum: { duration: true },
            });
            workedTime = timeAggregate._sum.duration ?? 0;
        }

        return res
            .status(200)
            .json({ status: 'success', data: { ...timeEntry, workedTime } });
    } catch {
        return res.status(500).json({ message: 'Failed to stop timer' });
    }
};

const getAllTimeEntries = async (req: Request, res: Response) => {
    try {
        const allEntries = await prisma.timeEntry.findMany({
            where: { userId: req.user!.id, endedAt: { not: null } },
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                task: {
                    select: {
                        title: true,
                        project: { select: { label: true, color: true } },
                    },
                },
            },
        });

        return res.status(200).json({ status: 'success', data: allEntries });
    } catch {
        return res.status(500).json({ message: 'Failed to get time entries' });
    }
};

const deleteTimeEntry = async (req: Request, res: Response) => {
    const parsedBody = DeleteTimeEntrySchema.safeParse(req.body);

    if (!parsedBody.success) {
        return res.status(400).json({
            message: 'Invalid input',
            code: 'VALIDATION_ERROR',
        });
    }

    try {
        const deletedEntry = await prisma.timeEntry.delete({
            where: { userId: req.user!.id, id: parsedBody.data.id },
        });

        return res
            .status(200)
            .json({ status: 'success', data: { taskId: deletedEntry.taskId } });
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
            return res
                .status(404)
                .json({ message: 'Time entry not found', code: 'ENTRY_NOT_FOUND' });
        }
        return res.status(500).json({ message: 'Failed to delete time entry' });
    }
};

export {
    startTimeEntry,
    stopTimeEntry,
    getActiveTimeEntry,
    getAllTimeEntries,
    deleteTimeEntry,
};
