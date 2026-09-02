import { z } from 'zod';
import { ProfileSchema } from './profileSchema';

export const RegisterPayloadSchema = z.object({
    email: z.email('Validation.invalidEmail'),
    password: z
        .string()
        .min(8, 'Validation.passwordMin')
        .regex(/[A-Z]/, 'Validation.passwordUppercase')
        .regex(/[^a-zA-Z0-9]/, 'Validation.passwordSpecial'),
    firstName: ProfileSchema.shape.firstName,
    lastName: ProfileSchema.shape.lastName,
    termsAccepted: z.boolean().refine((val) => val === true, 'Validation.termsRequired'),
});

export const RegisterSchema = RegisterPayloadSchema.extend({
    passwordAgain: z.string().min(8, 'Validation.passwordMin'),
}).refine((data) => data.password === data.passwordAgain, {
    message: 'Validation.passwordDontMatch',
    path: ['passwordAgain'],
});

export const LoginSchema = z.object({
    email: z.email('Validation.invalidEmail'),
    password: z.string().min(1, 'Validation.passwordHaveToBeFilled'),
});

export const ChangePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, 'Validation.passwordHaveToBeFilled'),
        newPassword: z
            .string()
            .min(8, 'Validation.passwordMin')
            .regex(/[A-Z]/, 'Validation.passwordUppercase')
            .regex(/[^a-zA-Z0-9]/, 'Validation.passwordSpecial'),
        newPasswordAgain: z.string().min(8, 'Validation.passwordMin'),
    })
    .refine((data) => data.newPassword === data.newPasswordAgain, {
        message: 'Validation.passwordDontMatch',
        path: ['newPasswordAgain'],
    });

export type RegisterData = z.infer<typeof RegisterSchema>;
export type LoginData = z.infer<typeof LoginSchema>;
export type ChangePasswordData = z.infer<typeof ChangePasswordSchema>;
