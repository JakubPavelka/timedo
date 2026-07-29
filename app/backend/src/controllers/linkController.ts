import { prisma } from '../db/db.js';
import { Response, Request } from 'express';
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

export { createLink };
