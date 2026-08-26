import { Request, Response } from 'express';
import { prisma } from '../db/db.js';
import { Prisma, TimeEntry } from '../generated/prisma/client.js';
import {
    EntryType,
    TimeEntrySchema,
    UpdateTimeEntrySchema,
    DeleteTimeEntrySchema,
    GetTimeEntryQuerySchema,
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

const updateTimeEntry = async (req: Request, res: Response) => {
    const parsedBody = UpdateTimeEntrySchema.safeParse(req.body);

    if (!parsedBody.success) {
        return res.status(400).json({
            message: 'Invalid input',
            code: 'VALIDATION_ERROR',
        });
    }

    const { taskId, description, id } = parsedBody.data;

    try {
        const entry = await prisma.timeEntry.findFirst({
            where: { id: id, userId: req.user!.id },
        });

        if (!entry) {
            return res.status(404).json({
                message: 'Entry not found',
                code: 'ENTRY_NOT_FOUND',
            });
        }

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

        const timeEntry = await prisma.timeEntry.update({
            where: { id: id },
            data: {
                ...(taskId !== undefined && { taskId }),
                ...(description !== undefined && { description }),
            },
        });

        return res.status(200).json({ status: 'success', data: timeEntry });
    } catch {
        return res.status(500).json({ message: 'Failed to update time entry' });
    }
};

const getTimeEntries = async (req: Request, res: Response) => {
    const parsedQuery = GetTimeEntryQuerySchema.safeParse(req.query);

    if (!parsedQuery.success) {
        return res.status(400).json({
            message: 'Invalid input',
            code: 'VALIDATION_ERROR',
        });
    }

    const { limit, search } = parsedQuery.data;

    try {
        const matchingEntryIds = search
            ? (
                  await prisma.$queryRaw<{ id: string }[]>`
                      SELECT te.id FROM "TimeEntry" te
                      LEFT JOIN "Task" t ON t.id = te."taskId"
                      WHERE te."userId" = ${req.user!.id}
                        AND te."endedAt" IS NOT NULL
                        AND (
                            unaccent(COALESCE(t.title, '')) ILIKE unaccent(${'%' + search + '%'})
                            OR unaccent(COALESCE(te.description, '')) ILIKE unaccent(${'%' + search + '%'})
                        )
                  `
              ).map((entry) => entry.id)
            : undefined;

        const where = {
            userId: req.user!.id,
            endedAt: { not: null },
            ...(matchingEntryIds && { id: { in: matchingEntryIds } }),
        };

        const [entries, total] = await Promise.all([
            prisma.timeEntry.findMany({
                where,
                orderBy: {
                    createdAt: 'desc',
                },
                take: limit,
                include: {
                    task: {
                        select: {
                            title: true,
                            project: { select: { label: true, color: true } },
                            estimatedTime: true,
                        },
                    },
                },
            }),
            prisma.timeEntry.count({ where }),
        ]);

        const taskIds = [
            ...new Set(
                entries
                    .map((entry) => entry.taskId)
                    .filter((taskId): taskId is string => !!taskId)
            ),
        ];

        const workedTimeByTask = taskIds.length
            ? await prisma.timeEntry.groupBy({
                  by: ['taskId'],
                  where: { taskId: { in: taskIds }, userId: req.user!.id },
                  _sum: { duration: true },
              })
            : [];

        const workedTimeMap = new Map(
            workedTimeByTask.map((entry) => [entry.taskId, entry._sum.duration ?? 0])
        );

        const entriesWithTaskWorkedTime = entries.map((entry) => ({
            ...entry,
            task: entry.task
                ? {
                      ...entry.task,
                      workedTime: workedTimeMap.get(entry.taskId!) ?? 0,
                  }
                : null,
        }));

        return res
            .status(200)
            .json({ status: 'success', data: entriesWithTaskWorkedTime, total });
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
    updateTimeEntry,
    getTimeEntries,
    deleteTimeEntry,
};
