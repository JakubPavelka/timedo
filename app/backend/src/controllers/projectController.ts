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

        const existingProject = await prisma.project.findUnique({
            where: {
                userId_label: {
                    userId: req.user!.id,
                    label: parsedBody.data.label,
                },
            },
        });

        if (existingProject) {
            return res.status(400).json({
                message: 'Project already exists',
                code: 'PROJECT_ALREADY_EXISTS',
            });
        }

        const project = await prisma.project.create({
            data: {
                label: parsedBody.data.label,
                color: parsedBody.data.color,
                userId: req.user!.id,
            },
        });

        return res.status(201).json({ status: 'success', data: { project } });
    } catch {
        return res.status(500).json({ message: 'Failed to create project' });
    }
};

export { createProject };
