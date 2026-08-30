import { z } from 'zod';

export const TaskChecklistSchema = z.object({
    taskId: z.string(),
    parentId: z.string().nullable().optional(),
    label: z
        .string()
        .trim()
        .min(1, 'Validation.labelMin')
        .max(255, 'Validation.checklistLabelMax'),
    order: z.number().int().optional(),
});

export type TaskChecklistData = z.infer<typeof TaskChecklistSchema>;

export const UpdateTaskChecklistSchema = z.object({
    id: z.string(),
    label: z
        .string()
        .trim()
        .min(1, 'Validation.labelMin')
        .max(255, 'Validation.checklistLabelMax')
        .optional(),
    completed: z.boolean().optional(),
    order: z.number().int().optional(),
    parentId: z.string().nullable().optional(),
});

export type UpdateTaskChecklistData = z.infer<typeof UpdateTaskChecklistSchema>;

export const DeleteTaskChecklistSchema = z.object({
    id: z.string(),
});

export type DeleteTaskChecklistData = z.infer<typeof DeleteTaskChecklistSchema>;
