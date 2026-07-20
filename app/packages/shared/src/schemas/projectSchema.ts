import { z } from 'zod';

export const ProjectSchema = z.object({
    label: z.string(),
    color: z.string(),
});

export type ProjectData = z.infer<typeof ProjectSchema>;
