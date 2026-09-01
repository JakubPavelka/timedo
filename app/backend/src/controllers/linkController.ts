import { prisma } from '../db/db.js';
import { Response, Request } from 'express';
import { Prisma } from '../generated/prisma/client.js';
import { LinkSchema, LinkBaseSchema } from '@timedo/shared//src/schemas/linkSchema.js';

const createLink = async (req: Request, res: Response) => {
    try {
        const parsedBody = LinkSchema.safeParse(req.body);

        if (!parsedBody.success) {
            return res.status(400).json({
                message: 'Invalid input',
                code: 'VALIDATION_ERROR',
            });
        }

        const task = await prisma.task.findUnique({
            where: { id: parsedBody.data.taskId },
        });

        if (!task || task.userId !== req.user!.id) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const { url, label } = parsedBody.data;

        const link = await prisma.link.create({
            data: {
                url,
                label,
                task: { connect: { id: parsedBody.data.taskId } },
                user: { connect: { id: req.user!.id } },
            },
        });

        return res.status(201).json({ message: 'success', data: link });
    } catch (err) {
        req.log.error(err, 'Failed to create link');
        return res.status(500).json({ message: 'Failed to create link' });
    }
};

const getLinks = async (req: Request, res: Response) => {
    try {
        const { taskId } = req.params;

        if (typeof taskId !== 'string') {
            return res.status(400).json({
                message: 'Task ID missing',
                code: 'NO_TASKID',
            });
        }

        const links = await prisma.link.findMany({
            where: { taskId, userId: req.user!.id },
            select: { label: true, url: true, id: true },
        });

        return res.status(200).json({ message: 'success', data: links });
    } catch (err) {
        req.log.error(err, 'Failed to get links');
        return res.status(500).json({ message: 'Failed to get links' });
    }
};

const deleteLink = async (req: Request, res: Response) => {
    try {
        const body = req.body;

        if (!body.id) {
            return res.status(400).json({
                message: 'Link ID missing',
                code: 'NO_LINKID',
            });
        }

        const deletedLink = await prisma.link.delete({
            where: { id: body.id, userId: req.user!.id },
        });

        return res.status(200).json({ message: 'success', data: deletedLink });
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
            return res.status(404).json({ message: 'Link not found' });
        }
        req.log.error(err, 'Failed to delete link');
        return res.status(500).json({ message: 'Failed to delete link' });
    }
};

const updateLink = async (req: Request, res: Response) => {
    try {
        const parsedBody = LinkBaseSchema.safeParse(req.body);

        if (!parsedBody.success) {
            return res.status(400).json({
                message: 'Invalid input',
                code: 'VALIDATION_ERROR',
            });
        }

        if (!req.body.id) {
            return res.status(400).json({
                message: 'Link ID missing',
                code: 'NO_LINKID',
            });
        }

        const { url, label } = parsedBody.data;

        const link = await prisma.link.update({
            where: { id: req.body.id, userId: req.user!.id },
            data: { url, label },
            select: { label: true, url: true },
        });

        return res.status(200).json({ message: 'success', data: link });
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
            return res.status(404).json({ message: 'Link not found' });
        }
        req.log.error(err, 'Failed to update link');
        return res.status(500).json({ message: 'Failed to update link' });
    }
};

export { createLink, deleteLink, updateLink, getLinks };
