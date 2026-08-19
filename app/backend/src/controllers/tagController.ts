import { prisma } from '../db/db.js';
import { Response, Request } from 'express';
import { TagSchema } from '@timedo/shared/src/schemas/tagsSchema.js';

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

        return res.status(201).json({ status: 'success', data: { tag } });
    } catch {
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
            },
        });

        return res.status(200).json({ status: 'success', data: tags });
    } catch {
        return res.status(500).json({ message: 'Failed to get tags' });
    }
};

export { createTag, getTags };
