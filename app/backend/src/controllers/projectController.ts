import { prisma } from '../db/db.js';
import { Response, Request } from 'express';
import { ProjectSchema } from '@timedo/shared/src/schemas/projectSchema.js';

const createProject = async (req: Request, res: Response) => {
    try {
        const parsedBody = ProjectSchema.safeParse(req.body);

        if (!parsedBody.success) {
            return res.status(400).json({
                message: 'Invalid input',
                code: 'VALIDATION_ERROR',
            });
        }

        const project = await prisma.project.create({
            data: {
                label: parsedBody.data.label,
                color: parsedBody.data.color,
            },
        });

        return res.status(201).json({ status: 'success', data: { project } });
    } catch {
        return res.status(500).json({ message: 'Failed to create project' });
    }
};

export { createProject };
