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
