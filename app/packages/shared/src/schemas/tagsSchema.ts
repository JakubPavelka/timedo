import { z } from 'zod';

export const TagSchema = z.object({
    label: z.string().min(1, 'Validation.labelMin').max(50, 'Validation.labelMax'),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Validation.colorFormat'),
});

export type TagData = z.infer<typeof TagSchema>;
