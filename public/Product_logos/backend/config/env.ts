import { z } from "zod";

/**
 * Environment variable contract for the application.
 * Fails fast (at import time) if required variables are missing or malformed,
 * instead of surfacing confusing runtime errors deep in a request handler.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_URL: z.string().url().default("http://localhost:3000"),
  API_VERSION: z.string().default("v1"),

  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),

  BETTER_AUTH_SECRET: z.string().min(32, "BETTER_AUTH_SECRET must be at least 32 characters"),
  BETTER_AUTH_URL: z.string().url(),

  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().email().optional(),

  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),

  ACCOUNT_LOCK_MAX_ATTEMPTS: z.coerce.number().int().positive().default(5),
  ACCOUNT_LOCK_BASE_MINUTES: z.coerce.number().int().positive().default(1),

  TWO_FACTOR_ISSUER: z.string().default("StepUp for AI"),

  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),

  DEFAULT_AI_PROVIDER: z.enum(["openai", "anthropic", "gemini", "groq"]).default("openai"),
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  GROQ_API_KEY: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const formatted = parsed.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");

    // Intentionally thrown synchronously so the app never boots with an invalid config.
    throw new Error(`Invalid environment configuration:\n${formatted}`);
  }

  return parsed.data;
}

export const env = loadEnv();
