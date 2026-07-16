import { z } from 'zod';

const namePattern = /^(?=.*\p{L})[\p{L}\s'-]+$/u;

export const ProfileSchema = z.object({
    firstName: z
        .string()
        .min(1, 'Validation.firstNameMin')
        .max(30, 'Validation.firstNameMax')
        .regex(namePattern, 'Validation.firstNameInvalid'),
    lastName: z
        .string()
        .min(1, 'Validation.lastNameMin')
        .max(30, 'Validation.lastNameMax')
        .regex(namePattern, 'Validation.lastNameInvalid')
        .optional()
        .or(z.literal('')),
});

export type ProfileData = z.infer<typeof ProfileSchema>;
