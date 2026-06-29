import { z } from 'zod';

export const ProfileSchema = z.object({
    firstName: z
        .string()
        .min(1, 'Validation.firstNameMin')
        .max(30, 'Validation.firstNameMax'),
    lastName: z
        .string()
        .min(1, 'Validation.lastNameMin')
        .max(30, 'Validation.lastNameMax')
        .optional()
        .or(z.literal('')),
});

export type ProfileData = z.infer<typeof ProfileSchema>;
