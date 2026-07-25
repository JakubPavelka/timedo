import { z } from 'zod';

export const Status = {
    TODO: 'TODO',
    ACTIVE: 'ACTIVE',
    DONE: 'DONE',
} as const;
export type Status = (typeof Status)[keyof typeof Status];

export const Priority = {
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH',
} as const;
export type Priority = (typeof Priority)[keyof typeof Priority];

export const TaskSchema = z.object({
    title: z.string().min(1, 'Validation.titleMin').max(255, 'Validation.titleMax'),
    description: z
        .string()
        .min(1, 'Validation.descriptionMin')
        .max(3000, 'Validation.descriptionMax')
        .optional()
        .or(z.literal('')),
    status: z.enum(Status).optional(),
    priority: z.enum(Priority).optional(),
    projectId: z.string().nullable().optional(),
    tags: z.array(z.string()).optional(),
});

export type TaskData = z.infer<typeof TaskSchema>;

export const GetTasksQuerySchema = z.object({
    limit: z.coerce.number().int().min(1).max(100).default(20),
    offset: z.coerce.number().int().min(0).default(0),
    priority: z.enum(Priority).optional(),
    status: z.enum(Status).optional(),
});

export type GetTasksQuery = z.infer<typeof GetTasksQuerySchema>;
