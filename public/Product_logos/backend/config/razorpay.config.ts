import { z } from "zod";

const razorpayEnvSchema = z.object({
  RAZORPAY_KEY_ID: z.string().min(1, "RAZORPAY_KEY_ID is required"),
  RAZORPAY_KEY_SECRET: z.string().min(1, "RAZORPAY_KEY_SECRET is required"),
  RAZORPAY_WEBHOOK_SECRET: z.string().min(1, "RAZORPAY_WEBHOOK_SECRET is required"),
});

export type RazorpayConfig = z.infer<typeof razorpayEnvSchema>;

/**
 * Validated lazily (on first use), same pattern as `config/cloudinary.config.ts`:
 * most of the app (Auth, Students, Recruiters, AI) never touches payments,
 * so it shouldn't be forced to have Razorpay credentials configured to boot
 * in local/dev/test environments.
 */
export function getRazorpayConfig(): RazorpayConfig {
  const parsed = razorpayEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const formatted = parsed.error.issues.map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`).join("\n");
    throw new Error(`Invalid Razorpay configuration:\n${formatted}`);
  }
  return parsed.data;
}
