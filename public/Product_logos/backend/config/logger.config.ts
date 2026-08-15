import pino from "pino";
import { env } from "@/config/env";

/**
 * Root Pino logger. All module-level loggers should be created via
 * `logger.child({ module: "..." })` rather than instantiating pino directly,
 * so every log line carries consistent metadata.
 */
export const logger = pino({
  level: env.LOG_LEVEL,
  base: {
    env: env.NODE_ENV,
  },
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "*.password",
      "*.passwordHash",
      "*.token",
      "*.secret",
      "*.otp",
    ],
    censor: "[REDACTED]",
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  transport:
    env.NODE_ENV === "development"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "HH:MM:ss.l",
            ignore: "pid,hostname",
          },
        }
      : undefined,
});

export function createModuleLogger(moduleName: string) {
  return logger.child({ module: moduleName });
}
