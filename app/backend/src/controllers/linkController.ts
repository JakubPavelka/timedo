import { prisma } from '../db/db.js';
import { Response, Request } from 'express';
import { Prisma } from '../generated/prisma/client.js';
import { LinkSchema } from '@timedo/shared//src/schemas/linkSchema.js';

const createLink = async (req: Request, res: Response) => {
    try {
        const parsedBody = LinkSchema.safeParse(req.body);

        if (!parsedBody.success) {
            return res.status(400).json({
                message: 'Invalid input',
                code: 'VALIDATION_ERROR',
            });
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
    } catch {
        return res.status(500).json({ message: 'Failed to create link' });
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
        return res.status(500).json({ message: 'Failed to delete link' });
    }
};

export { createLink, deleteLink };
