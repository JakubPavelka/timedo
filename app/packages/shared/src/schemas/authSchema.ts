import { z } from "zod";

export const RegisterSchema = z
  .object({
    email: z.email("Validation.invalidEmail"),
    password: z
      .string()
      .min(8, "Validation.passwordMin")
      .regex(/[A-Z]/, "Validation.passwordUppercase")
      .regex(/[^a-zA-Z0-9]/, "Validation.passwordSpecial"),
    passwordAgain: z.string().min(8, "Validation.passwordMin"),
    firstName: z
      .string()
      .min(1, "Validation.firstNameMin")
      .max(30, "Validation.firstNameMax"),
    lastName: z
      .string()
      .min(1, "Validation.lastNameMin")
      .max(30, "Validation.lastNameMax")
      .optional()
      .or(z.literal("")),
    termsAccepted: z
      .boolean()
      .refine((val) => val === true, "Validation.termsRequired"),
  })
  .refine((data) => data.password === data.passwordAgain, {
    message: "Validation.passwordDontMatch",
    path: ["passwordAgain"],
  });

export const LoginSchema = z.object({
  email: z.email("Validation.invalidEmail"),
  password: z.string().min(1, "Validation.passwordHaveToBeFilled"),
});

export type RegisterData = z.infer<typeof RegisterSchema>;
export type LoginData = z.infer<typeof LoginSchema>;
