import { z } from 'zod';

export const ProjectSchema = z.object({
    label: z
        .string()
        .min(1, 'Validation.labelMin')
        .max(50, 'Validation.labelMax'),
    color: z.string(),
});

export type ProjectData = z.infer<typeof ProjectSchema>;
