import { prisma } from '../db/db.js';
import { Response, Request } from 'express';
import { Prisma } from '../generated/prisma/client.js';
import {
    ProjectSchema,
    DeleteProjectSchema,
    UpdateProjectSchema,
} from '@timedo/shared/src/schemas/projectSchema';

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

        return res.status(201).json({ status: 'success', data: project });
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
            return res.status(400).json({
                message: 'Project already exists',
                code: 'PROJECT_ALREADY_EXISTS',
            });
        }
        req.log.error(err, 'Failed to create project');
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
            orderBy: { createdAt: 'desc' },
        });

        return res.status(200).json({ status: 'success', data: projects });
    } catch (err) {
        req.log.error(err, 'Failed to get projects');
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
            orderBy: { createdAt: 'desc' },
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
    } catch (err) {
        req.log.error(err, 'Failed to get projects with tasks');
        return res.status(500).json({ message: 'Failed to get projects' });
    }
};

const updateProject = async (req: Request, res: Response) => {
    const parsedBody = UpdateProjectSchema.safeParse(req.body);

    if (!parsedBody.success) {
        return res.status(400).json({
            message: 'Invalid input',
            code: 'VALIDATION_ERROR',
        });
    }

    const { color, id, label } = parsedBody.data;

    try {
        const project = await prisma.project.update({
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

        return res.status(200).json({ status: 'success', data: project });
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
            return res.status(404).json({ message: 'Project not found' });
        }
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
            return res.status(400).json({
                message: 'Project already exists',
                code: 'PROJECT_ALREADY_EXISTS',
            });
        }
        req.log.error(err, 'Failed to update project');
        return res.status(500).json({ message: 'Failed to update project' });
    }
};

const deleteProject = async (req: Request, res: Response) => {
    const parsedBody = DeleteProjectSchema.safeParse(req.body);

    if (!parsedBody.success) {
        return res.status(400).json({
            message: 'Invalid input',
            code: 'VALIDATION_ERROR',
        });
    }

    const { id } = parsedBody.data;

    try {
        const project = await prisma.project.findFirst({
            where: { id: id, userId: req.user!.id },
        });

        if (!project) {
            return res
                .status(404)
                .json({ message: 'Project not found', code: 'PROJECT_NOT_FOUND' });
        }

        await prisma.project.delete({
            where: { id: id },
        });

        return res.status(204).send();
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
            return res.status(404).json({ message: 'Project not found' });
        }
        req.log.error(err, 'Failed to delete project');
        return res.status(500).json({ message: 'Failed to delete project' });
    }
};

export { createProject, getProjects, getProjectsWithTasks, updateProject, deleteProject };
