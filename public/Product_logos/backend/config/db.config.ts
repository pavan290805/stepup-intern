import mongoose from "mongoose";
import { env } from "@/config/env";
import { createModuleLogger } from "@/config/logger.config";
import { registerAllEventListeners } from "@/events/event-emitter";

const logger = createModuleLogger("database");

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

/**
 * Next.js serverless functions can be invoked concurrently within the same
 * process (hot lambda reuse). Without caching the connection on `globalThis`,
 * every invocation would attempt a new connection, quickly exhausting Atlas's
 * connection limit. This is the standard Mongoose + serverless pattern.
 */
declare global {
  // eslint-disable-next-line no-var
  var __mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache = global.__mongooseCache ?? { conn: null, promise: null };
global.__mongooseCache = cache;

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    mongoose.set("strictQuery", true);

    cache.promise = mongoose
      .connect(env.MONGODB_URI, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 10_000,
      })
      .then((mongooseInstance) => {
        logger.info("MongoDB connected");
        return mongooseInstance;
      })
      .catch((error) => {
        cache.promise = null;
        logger.error({ err: error }, "MongoDB connection failed");
        throw error;
      });
  }

  cache.conn = await cache.promise;
  registerAllEventListeners();
  return cache.conn;
}

export async function disconnectFromDatabase(): Promise<void> {
  if (cache.conn) {
    await cache.conn.disconnect();
    cache.conn = null;
    cache.promise = null;
    logger.info("MongoDB disconnected");
  }
}

export function getConnectionState(): "connected" | "connecting" | "disconnected" | "disconnecting" {
  const states = ["disconnected", "connected", "connecting", "disconnecting"] as const;
  const readyState = mongoose.connection.readyState;
  return states[readyState as 0 | 1 | 2 | 3] ?? "disconnected";
}
