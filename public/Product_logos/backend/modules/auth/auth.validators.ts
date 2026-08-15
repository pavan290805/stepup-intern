import { z } from "zod";
import { emailSchema, otpCodeSchema, passwordSchema } from "@/shared/types/common.schemas";
import { SELF_REGISTERABLE_ROLES } from "@/shared/constants/roles";

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  role: z.enum(
    SELF_REGISTERABLE_ROLES as [string, ...string[]],
    { errorMap: () => ({ message: "Role must be one of: student, recruiter, investor, mentor" }) }
  ),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type RegisterDto = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
  twoFactorCode: otpCodeSchema.optional(),
});

export type LoginDto = z.infer<typeof loginSchema>;

export const verifyEmailSchema = z.object({
  token: z.string().min(1, "Verification token is required"),
});

export type VerifyEmailDto = z.infer<typeof verifyEmailSchema>;

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required"),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;

export const enableTwoFactorSchema = z.object({
  password: z.string().min(1, "Password confirmation is required"),
});

export type EnableTwoFactorDto = z.infer<typeof enableTwoFactorSchema>;

export const verifyTwoFactorSchema = z.object({
  code: otpCodeSchema,
});

export type VerifyTwoFactorDto = z.infer<typeof verifyTwoFactorSchema>;

/** Payload for confirming 2FA enrollment: the TOTP secret issued during
 * `initiateTwoFactor`, proven by a valid current code from the user's app. */
export const confirmTwoFactorSchema = z.object({
  secret: z.string().min(1, "TOTP secret is required"),
  code: otpCodeSchema,
});

export type ConfirmTwoFactorDto = z.infer<typeof confirmTwoFactorSchema>;

export const refreshSessionSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required").optional(),
});

export type RefreshSessionDto = z.infer<typeof refreshSessionSchema>;
