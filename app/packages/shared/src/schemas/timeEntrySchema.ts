import { z } from 'zod';

export const TimeEntrySchema = z.object({
    taskId: z.string().optional(),
    description: z.string().optional(),
});

export type TimeEntryData = z.infer<typeof TimeEntrySchema>;
