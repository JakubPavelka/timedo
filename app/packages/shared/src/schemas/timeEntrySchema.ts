import { z } from 'zod';

export const EntryType = {
    STOPWATCH: 'STOPWATCH',
    POMODORO: 'POMODORO',
} as const;
export type EntryType = (typeof EntryType)[keyof typeof EntryType];

export const TimeEntrySchema = z
    .object({
        taskId: z.string().optional(),
        description: z.string().optional(),
        type: z.enum(EntryType).default(EntryType.STOPWATCH),
        plannedDuration: z.number().int().positive().optional(),
    })
    .refine(
        (data) => data.type !== EntryType.POMODORO || data.plannedDuration !== undefined,
        {
            message: 'Validation.plannedDurationRequired',
            path: ['plannedDuration'],
        }
    );

export type TimeEntryData = z.infer<typeof TimeEntrySchema>;

export const UpdateTimeEntrySchema = z.object({
    id: z.string(),
    taskId: z.string().nullable().optional(),
    description: z.string().optional(),
});

export type UpdateTimeEntryData = z.infer<typeof UpdateTimeEntrySchema>;

export const DeleteTimeEntrySchema = z.object({
    id: z.string(),
});

export type DeleteTimeEntryData = z.infer<typeof DeleteTimeEntrySchema>;

export const GetTimeEntryQuerySchema = z.object({
    limit: z.coerce.number().int().min(1).max(100).default(5),
    search: z.string().optional(),
});

export type GetTimeEntryQuery = z.infer<typeof GetTimeEntryQuerySchema>;
