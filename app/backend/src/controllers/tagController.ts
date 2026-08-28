import { prisma } from '../db/db.js';
import { Response, Request } from 'express';
import { Prisma } from '../generated/prisma/client.js';
import {
    TagSchema,
    UpdateTagSchema,
    DeleteTagSchema,
} from '@timedo/shared/src/schemas/tagsSchema.js';

const createTag = async (req: Request, res: Response) => {
    try {
        const parsedBody = TagSchema.safeParse(req.body);

        if (!parsedBody.success) {
            return res.status(400).json({
                message: 'Invalid input',
                code: 'VALIDATION_ERROR',
            });
        }

        const existingTag = await prisma.taskTag.findUnique({
            where: {
                userId_label: {
                    userId: req.user!.id,
                    label: parsedBody.data.label,
                },
            },
        });

        if (existingTag) {
            return res.status(400).json({
                message: 'Tag already exists',
                code: 'TAG_ALREADY_EXISTS',
            });
        }

        const tagsCount = await prisma.taskTag.count({
            where: { userId: req.user!.id },
        });

        if (tagsCount >= 80) {
            return res.status(400).json({
                message: 'You have reached maximum limit of tags',
                code: 'TAGS_LIMIT_REACHED',
            });
        }

        const tag = await prisma.taskTag.create({
            data: {
                label: parsedBody.data.label,
                color: parsedBody.data.color,
                userId: req.user!.id,
            },
        });

        return res.status(201).json({ status: 'success', data: tag });
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
            return res.status(400).json({
                message: 'Tag already exists',
                code: 'TAG_ALREADY_EXISTS',
            });
        }
        return res.status(500).json({ message: 'Failed to create tags' });
    }
};

const getTags = async (req: Request, res: Response) => {
    try {
        const tags = await prisma.taskTag.findMany({
            where: { userId: req.user!.id },
            select: {
                id: true,
                label: true,
                color: true,
                _count: {
                    select: { tasks: true },
                },
            },
        });

        return res.status(200).json({ status: 'success', data: tags });
    } catch {
        return res.status(500).json({ message: 'Failed to get tags' });
    }
};

const getTagsWithTasks = async (req: Request, res: Response) => {
    try {
        const tags = await prisma.taskTag.findMany({
            where: { userId: req.user!.id },
            select: {
                id: true,
                label: true,
                color: true,
                tasks: {
                    select: {
                        status: true,
                        timeEntries: {
                            select: { duration: true },
                        },
                    },
                },
            },
        });

        const data = tags.map(({ tasks, ...tag }) => {
            const totalTasks = tasks.length;
            const tasksDone = tasks.filter((task) => task.status === 'DONE').length;
            const duration = tasks.reduce(
                (taskSum, task) =>
                    taskSum +
                    task.timeEntries.reduce(
                        (entrySum, entry) => entrySum + (entry.duration ?? 0),
                        0
                    ),
                0
            );

            return { ...tag, totalTasks, tasksDone, duration };
        });

        return res.status(200).json({ status: 'success', data });
    } catch {
        return res.status(500).json({ message: 'Failed to get tags' });
    }
};

const updateTag = async (req: Request, res: Response) => {
    const parsedBody = UpdateTagSchema.safeParse(req.body);

    if (!parsedBody.success) {
        return res.status(400).json({
            message: 'Invalid input',
            code: 'VALIDATION_ERROR',
        });
    }

    const { color, id, label } = parsedBody.data;

    try {
        const tag = await prisma.taskTag.update({
            where: { id: id, userId: req.user!.id },
            data: {
                label,
                color,
            },
            select: {
                id: true,
                label: true,
                color: true,
            },
        });

        return res.status(200).json({ status: 'success', data: tag });
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
            return res.status(404).json({ message: 'Tag not found' });
        }
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
            return res.status(400).json({
                message: 'Tag already exists',
                code: 'TAG_ALREADY_EXISTS',
            });
        }
        return res.status(500).json({ message: 'Failed to update tag' });
    }
};

const deleteTag = async (req: Request, res: Response) => {
    const parsedBody = DeleteTagSchema.safeParse(req.body);

    if (!parsedBody.success) {
        return res.status(400).json({
            message: 'Invalid input',
            code: 'VALIDATION_ERROR',
        });
    }

    const { id } = parsedBody.data;

    try {
        const tag = await prisma.taskTag.findFirst({
            where: { id: id, userId: req.user!.id },
        });

        if (!tag) {
            return res
                .status(404)
                .json({ message: 'Tag not found', code: 'TAG_NOT_FOUND' });
        }

        await prisma.taskTag.delete({
            where: { id: id },
        });

        return res.status(204).send();
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
            return res.status(404).json({ message: 'Tag not found' });
        }
        return res.status(500).json({ message: 'Failed to delete tag' });
    }
};

export { createTag, getTags, getTagsWithTasks, updateTag, deleteTag };
