import { Request, Response } from 'express';
import { prisma } from '../db/db.js';
import {
    TaskSchema,
    GetTasksQuerySchema,
} from '@timedo/shared/src/schemas/taskSchema.js';
import { Prisma } from '../generated/prisma/client.js';

const UpdateTaskSchema = TaskSchema.partial();

const createTask = async (req: Request, res: Response) => {
    const parsedBody = TaskSchema.safeParse(req.body);

    if (!parsedBody.success) {
        return res.status(400).json({
            message: 'Invalid input',
            code: 'VALIDATION_ERROR',
        });
    }

    const { title, description, priority, projectId, status, tags, links } =
        parsedBody.data;

    try {
        if (projectId) {
            const project = await prisma.project.findUnique({
                where: { id: projectId, userId: req.user!.id },
                select: { id: true },
            });

            if (!project) {
                return res.status(404).json({ message: 'Project not found' });
            }
        }

        if (tags?.length) {
            const uniqueTagIds = new Set(tags);

            const ownedTagsCount = await prisma.taskTag.count({
                where: { id: { in: tags }, userId: req.user!.id },
            });

            if (ownedTagsCount !== uniqueTagIds.size) {
                return res.status(404).json({ message: 'Tag not found' });
            }
        }

        const createdTask = await prisma.task.create({
            data: {
                title,
                description,
                priority,
                status,
                projectId: projectId ?? undefined,
                userId: req.user!.id,
                tags: tags?.length ? { connect: tags.map((id) => ({ id })) } : undefined,
                links: links?.length
                    ? { create: links.map((link) => ({ ...link, userId: req.user!.id })) }
                    : undefined,
            },
            select: {
                id: true,
                description: true,
                priority: true,
                project: {
                    select: {
                        id: true,
                        label: true,
                        color: true,
                    },
                },
                tags: {
                    select: {
                        id: true,
                        label: true,
                        color: true,
                    },
                },
                title: true,
                status: true,
                links: {
                    select: {
                        id: true,
                        label: true,
                        url: true,
                    },
                },
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

const getTasks = async (req: Request, res: Response) => {
    const parsedQuery = GetTasksQuerySchema.safeParse(req.query);

    if (!parsedQuery.success) {
        return res.status(400).json({
            message: 'Invalid input',
            code: 'VALIDATION_ERROR',
        });
    }

    const { limit, offset, priority, status, project, search } = parsedQuery.data;

    try {
        const matchingTaskIds = search
            ? (
                  await prisma.$queryRaw<{ id: string }[]>`
                      SELECT id FROM "Task"
                      WHERE "userId" = ${req.user!.id}
                        AND unaccent(title) ILIKE unaccent(${'%' + search + '%'})
                  `
              ).map((task) => task.id)
            : undefined;

        const tasks = await prisma.task.findMany({
            where: {
                userId: req.user!.id,
                ...(priority?.length && { priority: { in: priority } }),
                ...(status && { status }),
                ...(project?.length && { projectId: { in: project } }),
                ...(matchingTaskIds && { id: { in: matchingTaskIds } }),
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset,
            select: {
                id: true,
                description: true,
                priority: true,
                project: {
                    select: {
                        id: true,
                        label: true,
                        color: true,
                    },
                },
                tags: {
                    select: {
                        id: true,
                        label: true,
                        color: true,
                    },
                },
                title: true,
                status: true,
                links: {
                    select: {
                        id: true,
                        label: true,
                        url: true,
                    },
                },
            },
        });

        return res.status(200).json({ status: 'success', data: tasks });
    } catch {
        return res.status(500).json({ message: 'Failed to get tasks' });
    }
};

const getTask = async (req: Request, res: Response) => {
    const taskId = req.params.task;

    if (typeof taskId !== 'string') {
        return res.status(400).json({
            message: 'Invalid input',
            code: 'VALIDATION_ERROR',
        });
    }

    try {
        const task = await prisma.task.findUnique({
            where: { id: taskId },
            select: {
                id: true,
                userId: true,
                description: true,
                priority: true,
                project: {
                    select: {
                        id: true,
                        label: true,
                        color: true,
                    },
                },
                tags: {
                    select: {
                        id: true,
                        label: true,
                        color: true,
                    },
                },
                title: true,
                status: true,
                links: {
                    select: {
                        id: true,
                        label: true,
                        url: true,
                    },
                },
            },
        });

        if (!task || task.userId !== req.user!.id) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { userId, ...taskData } = task;

        return res.status(200).json({ status: 'success', data: taskData });
    } catch {
        return res.status(500).json({ message: 'Failed to get task' });
    }
};

const updateTask = async (req: Request, res: Response) => {
    const taskId = req.params.task;

    if (typeof taskId !== 'string') {
        return res.status(400).json({
            message: 'Invalid input',
            code: 'VALIDATION_ERROR',
        });
    }

    try {
        const parsedBody = UpdateTaskSchema.safeParse(req.body);

        if (!parsedBody.success) {
            return res.status(400).json({
                message: 'Invalid input',
                code: 'VALIDATION_ERROR',
            });
        }

        const { title, description, priority, status, projectId, tags } = parsedBody.data;

        const task = await prisma.task.findUnique({ where: { id: taskId } });

        if (!task || task.userId !== req.user!.id) {
            return res.status(404).json({ message: 'Task not found', code: 'TASK_NOT_FOUND' });
        }

        if (projectId) {
            const project = await prisma.project.findUnique({
                where: { id: projectId, userId: req.user!.id },
                select: { id: true },
            });

            if (!project) {
                return res.status(404).json({ message: 'Project not found' });
            }
        }

        if (tags?.length) {
            const uniqueTagIds = new Set(tags);

            const ownedTagsCount = await prisma.taskTag.count({
                where: { id: { in: tags }, userId: req.user!.id },
            });

            if (ownedTagsCount !== uniqueTagIds.size) {
                return res.status(404).json({ message: 'Tag not found' });
            }
        }

        const updated = await prisma.task.update({
            where: { id: taskId },
            data: {
                title,
                description,
                status,
                priority,
                ...(projectId !== undefined && { projectId }),
                ...(tags !== undefined && { tags: { set: tags.map((id) => ({ id })) } }),
            },
            select: {
                id: true,
                description: true,
                priority: true,
                project: {
                    select: {
                        id: true,
                        label: true,
                        color: true,
                    },
                },
                tags: {
                    select: {
                        id: true,
                        label: true,
                        color: true,
                    },
                },
                title: true,
                status: true,
                links: {
                    select: {
                        id: true,
                        label: true,
                        url: true,
                    },
                },
            },
        });

        return res.json({ status: 'success', data: updated });
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
            return res.status(404).json({ message: 'Task not found' });
        }
        return res.status(500).json({ message: 'Failed to update task' });
    }
};

export { createTask, getTasks, getTask, updateTask };
