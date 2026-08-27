import { z } from 'zod';

export const ProjectSchema = z.object({
    label: z
        .string()
        .trim()
        .min(1, 'Validation.labelMin')
        .max(50, 'Validation.labelMax'),
    color: z
        .string()
        .regex(/^#[0-9A-Fa-f]{6}$/, 'Validation.colorFormat'),
});

export type ProjectData = z.infer<typeof ProjectSchema>;
