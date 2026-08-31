import { Request, Response } from 'express';
import {
    TaskChecklistSchema,
    DeleteTaskChecklistSchema,
    UpdateTaskChecklistSchema,
} from '@timedo/shared/src/schemas/taskChecklistSchema';
import { prisma } from '../db/db';
import { Prisma } from '../generated/prisma/client';

const GetTaskChecklistSchema = TaskChecklistSchema.pick({ taskId: true });

const createTaskChecklist = async (req: Request, res: Response) => {
    const parsedBody = TaskChecklistSchema.safeParse(req.body);

    if (!parsedBody.success) {
        return res.status(400).json({
            message: 'Invalid input',
            code: 'VALIDATION_ERROR',
        });
    }

    const { label, taskId, parentId } = parsedBody.data;

    try {
        const task = await prisma.task.findUnique({
            where: { id: taskId, userId: req.user!.id },
        });

        if (!task) {
            return res
                .status(404)
                .json({ message: 'Task not found', code: 'TASK_NOT_FOUND' });
        }

        if (parentId) {
            const parent = await prisma.taskChecklist.findUnique({
                where: { id: parentId, taskId, userId: req.user!.id },
            });

            if (!parent) {
                return res.status(404).json({
                    message: 'Parent checklist item not found',
                    code: 'PARENT_CHECKLIST_NOT_FOUND',
                });
            }
        }

        const checklistItem = await prisma.taskChecklist.create({
            data: {
                label,
                taskId,
                userId: req.user!.id,
                parentId,
            },
        });

        return res.status(201).json({
            status: 'success',
            data: checklistItem,
        });
    } catch {
        return res.status(500).json({ message: 'Failed to create checklist' });
    }
};

const getTasksChecklist = async (req: Request, res: Response) => {
    const parsedQuery = GetTaskChecklistSchema.safeParse(req.query);

    if (!parsedQuery.success) {
        return res.status(400).json({
            message: 'Invalid input',
            code: 'VALIDATION_ERROR',
        });
    }

    const { taskId } = parsedQuery.data;

    try {
        const taskChecklists = await prisma.taskChecklist.findMany({
            where: { taskId, userId: req.user!.id },
            orderBy: { createdAt: 'asc' },
        });

        return res.status(200).json({ message: 'success', data: taskChecklists });
    } catch {
        return res.status(500).json({ message: 'Failed to get task checklist' });
    }
};

const deleteTaskChecklist = async (req: Request, res: Response) => {
    const parsedBody = DeleteTaskChecklistSchema.safeParse(req.body);

    if (!parsedBody.success) {
        return res.status(400).json({
            message: 'Invalid input',
            code: 'VALIDATION_ERROR',
        });
    }

    const { id } = parsedBody.data;

    try {
        await prisma.taskChecklist.delete({
            where: { id, userId: req.user!.id },
        });

        return res.status(204).send();
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
            return res.status(404).json({
                message: 'Task checklist not found',
                code: 'TASK_CHECKLIST_NOT_FOUND',
            });
        }
        return res.status(500).json({ message: 'Failed to delete task checklist' });
    }
};

const updateTaskChecklist = async (req: Request, res: Response) => {
    const parsedBody = UpdateTaskChecklistSchema.safeParse(req.body);

    if (!parsedBody.success) {
        return res.status(400).json({
            message: 'Invalid input',
            code: 'VALIDATION_ERROR',
        });
    }

    const { completed, label, id, parentId, order } = parsedBody.data;

    try {
        if (parentId) {
            const checklistItem = await prisma.taskChecklist.findUnique({
                where: { id, userId: req.user!.id },
            });

            if (!checklistItem) {
                return res.status(404).json({
                    message: 'Task checklist not found',
                    code: 'TASK_CHECKLIST_NOT_FOUND',
                });
            }

            const parent = await prisma.taskChecklist.findUnique({
                where: {
                    id: parentId,
                    taskId: checklistItem.taskId,
                    userId: req.user!.id,
                },
            });

            if (!parent) {
                return res.status(404).json({
                    message: 'Parent checklist item not found',
                    code: 'PARENT_CHECKLIST_NOT_FOUND',
                });
            }
        }

        const updatedChecklist = await prisma.taskChecklist.update({
            where: { id, userId: req.user!.id },
            data: {
                completed,
                label,
                parentId,
                order,
            },
        });

        return res.status(200).json({
            status: 'success',
            data: updatedChecklist,
        });
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
            return res.status(404).json({
                message: 'Task checklist not found',
                code: 'TASK_CHECKLIST_NOT_FOUND',
            });
        }
        return res.status(500).json({ message: 'Failed to update task checklist' });
    }
};

export {
    createTaskChecklist,
    deleteTaskChecklist,
    updateTaskChecklist,
    getTasksChecklist,
};
