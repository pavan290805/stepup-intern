import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { twoFactor } from "better-auth/plugins";
import mongoose from "mongoose";
import { z } from "zod";
import { env } from "@/config/env";
import { ALL_ROLES, ROLES } from "@/shared/constants/roles";

/**
 * Better Auth owns session issuance, cookie signing/rotation, and the
 * `user` / `session` / `account` / `verification` collections in Mongo.
 * Our own `UserModel` (database/models/user.model.ts) is the domain model
 * used by the rest of the app (RBAC, profile relations, etc.) and is kept
 * in sync with Better Auth's user record via the `role`/`status` fields
 * declared below as additional fields on Better Auth's user schema, and via
 * the `databaseHooks` in modules/auth/auth.service.ts.
 *
 * We reuse the existing Mongoose connection's underlying MongoClient rather
 * than opening a second connection, since Vercel serverless functions must
 * conserve connection pool slots.
 */
function getMongoDb() {
  const client = mongoose.connection.getClient();
  return client.db();
}

export const auth = betterAuth({
  database: mongodbAdapter(getMongoDb()),
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    requireEmailVerification: true,
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // rotate/refresh once per day of activity
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },

  advanced: {
    useSecureCookies: env.NODE_ENV === "production",
    defaultCookieAttributes: {
      httpOnly: true,
      sameSite: "lax",
    },
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: ROLES.STUDENT,
        input: true,
        validator: {
          input: z.enum(ALL_ROLES as [string, ...string[]]),
        },
      },
      status: {
        type: "string",
        required: false,
        defaultValue: "pending",
        input: false,
      },
    },
  },

  plugins: [
    twoFactor({
      issuer: env.TWO_FACTOR_ISSUER,
    }),
  ],
});

export type AuthInstance = typeof auth;
