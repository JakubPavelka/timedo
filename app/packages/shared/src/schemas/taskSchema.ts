import { z } from 'zod';

enum Status {
    TODO,
    ACTIVE,
    DONE,
}

enum Priority {
    LOW,
    MEDIUM,
    HIGH,
}

export const TaskSchema = z.object({
    title: z
        .string()
        .min(1, 'Validation.titleMin')
        .max(255, 'Validation.titleMax'),
    description: z
        .string()
        .min(1, 'Validation.descriptionMin')
        .max(3000, 'Validation.descriptionMax')
        .optional()
        .or(z.literal('')),
    status: z.enum(Status).optional(),
    priority: z.enum(Priority).optional(),
    projectId: z.string().nullable().optional(),
});

export type TaskData = z.infer<typeof TaskSchema>;
