import { z } from 'zod';
import { LinkBaseSchema } from './linkSchema';

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
    title: z.string().trim().min(1, 'Validation.titleMin').max(255, 'Validation.titleMax'),
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
    links: z.array(LinkBaseSchema).optional(),
    isTracked: z.boolean().default(true).optional(),
    estimatedTime: z.number('Validation.estimatedTimeInvalid').optional(),
});

export type TaskData = z.infer<typeof TaskSchema>;

export const UpdateTaskSchema = TaskSchema.omit({ isTracked: true })
    .partial()
    .extend({ isTracked: z.boolean().optional() });

export type UpdateTaskData = z.infer<typeof UpdateTaskSchema>;

export const GetTasksQuerySchema = z.object({
    limit: z.coerce.number().int().min(1).max(100).default(20),
    offset: z.coerce.number().int().min(0).default(0),
    priority: z.array(z.enum(Priority)).optional(),
    status: z.enum(Status).optional(),
    project: z.array(z.string()).optional(),
    search: z.string().optional(),
});

export type GetTasksQuery = z.infer<typeof GetTasksQuerySchema>;

export const DeleteTasksSchema = z.object({
    taskIds: z.array(z.string()).min(1, 'Validation.taskIdsMin'),
});

export type DeleteTasksData = z.infer<typeof DeleteTasksSchema>;

export const UpdateTasksSchema = z.object({
    taskIds: z.array(z.string()).min(1, 'Validation.taskIdsMin'),
    status: z.enum(Status).optional(),
    priority: z.enum(Priority).optional(),
    projectId: z.string().nullable().optional(),
    tags: z.array(z.string()).optional(),
});

export type UpdateTasksData = z.infer<typeof UpdateTasksSchema>;
