import { z } from "zod";

export const emailSchema = z.string().trim().email();

export const passwordSchema = z
  .string()
  .min(8)
  .max(128)
  .refine(
    (value) => /[A-Za-z]/.test(value) && /\d/.test(value),
    "Password must contain at least one letter and one number"
  );

export const otpCodeSchema = z.string().trim().regex(/^\d{6}$/, "OTP code must be 6 digits");

export const mongoIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB id");
