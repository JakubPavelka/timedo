import { z } from 'zod';

export const LinkBaseSchema = z.object({
    label: z.string().trim().min(1, 'Validation.labelMin').max(50, 'Validation.labelMax'),
    url: z.url('Validation.invalidUrl'),
});

export const LinkSchema = LinkBaseSchema.extend({
    taskId: z.string(),
});

export type LinkData = z.infer<typeof LinkSchema>;
