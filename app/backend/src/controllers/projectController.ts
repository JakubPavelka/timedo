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

        const projectsCount = await prisma.project.count({
            where: { userId: req.user!.id },
        });

        if (projectsCount >= 30) {
            return res.status(400).json({
                message: 'You have reached maximum limit of projects',
                code: 'PROJECTS_LIMIT_REACHED',
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

const getProjects = async (req: Request, res: Response) => {
    try {
        const projects = await prisma.project.findMany({
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

        return res.status(200).json({ status: 'success', data: projects });
    } catch {
        return res.status(500).json({ message: 'Failed to get projects' });
    }
};

const getProjectsWithTasks = async (req: Request, res: Response) => {
    try {
        const projects = await prisma.project.findMany({
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

        const data = projects.map(({ tasks, ...project }) => {
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

            return { ...project, totalTasks, tasksDone, duration };
        });

        return res.status(200).json({ status: 'success', data });
    } catch {
        return res.status(500).json({ message: 'Failed to get projects' });
    }
};

export { createProject, getProjects, getProjectsWithTasks };
