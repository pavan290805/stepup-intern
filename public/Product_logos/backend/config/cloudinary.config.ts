import { v2 as cloudinary } from "cloudinary";
import { z } from "zod";

const cloudinaryEnvSchema = z.object({
  CLOUDINARY_CLOUD_NAME: z.string().min(1, "CLOUDINARY_CLOUD_NAME is required"),
  CLOUDINARY_API_KEY: z.string().min(1, "CLOUDINARY_API_KEY is required"),
  CLOUDINARY_API_SECRET: z.string().min(1, "CLOUDINARY_API_SECRET is required"),
});

/**
 * Cloudinary credentials are validated lazily (on first use) rather than at
 * module load time like `config/env.ts`, since Phase 1/health-check routes
 * and most of the Auth module never touch file storage and shouldn't be
 * forced to have Cloudinary configured to boot in local/dev/test.
 */
let configured = false;

function ensureConfigured(): void {
  if (configured) return;

  const parsed = cloudinaryEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const formatted = parsed.error.issues.map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`).join("\n");
    throw new Error(`Invalid Cloudinary configuration:\n${formatted}`);
  }

  cloudinary.config({
    cloud_name: parsed.data.CLOUDINARY_CLOUD_NAME,
    api_key: parsed.data.CLOUDINARY_API_KEY,
    api_secret: parsed.data.CLOUDINARY_API_SECRET,
    secure: true,
  });

  configured = true;
}

export function getCloudinaryClient(): typeof cloudinary {
  ensureConfigured();
  return cloudinary;
}
