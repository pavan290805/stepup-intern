import { Schema, model, models, type Model, type HydratedDocument } from "mongoose";
import { ALL_ROLES, ROLES, USER_STATUS, type Role, type UserStatus } from "@/shared/constants/roles";

export interface IUser {
  email: string;
  passwordHash: string;
  role: Role;
  status: UserStatus;
  emailVerified: boolean;

  // Email verification
  emailVerificationTokenHash: string | null;
  emailVerificationExpiresAt: Date | null;

  // Password reset
  passwordResetTokenHash: string | null;
  passwordResetExpiresAt: Date | null;

  // Brute-force / account lock
  failedLoginAttempts: number;
  lockedUntil: Date | null;

  // 2FA (TOTP)
  twoFactorEnabled: boolean;
  twoFactorSecret: string | null;
  twoFactorBackupCodeHashes: string[];

  // Refresh token rotation (server-side session tracking; see auth.repository)
  lastLoginAt: Date | null;
  lastLoginIp: string | null;

  createdAt: Date;
  updatedAt: Date;
}

export type UserDocument = HydratedDocument<IUser>;

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ALL_ROLES,
      required: true,
      default: ROLES.STUDENT,
    },
    status: {
      type: String,
      enum: Object.values(USER_STATUS),
      default: USER_STATUS.PENDING,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },

    emailVerificationTokenHash: {
      type: String,
      default: null,
      select: false,
    },
    emailVerificationExpiresAt: {
      type: Date,
      default: null,
      select: false,
    },

    passwordResetTokenHash: {
      type: String,
      default: null,
      select: false,
    },
    passwordResetExpiresAt: {
      type: Date,
      default: null,
      select: false,
    },

    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lockedUntil: {
      type: Date,
      default: null,
    },

    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorSecret: {
      type: String,
      default: null,
      select: false,
    },
    twoFactorBackupCodeHashes: {
      type: [String],
      default: [],
      select: false,
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },
    lastLoginIp: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.passwordHash;
        delete ret.emailVerificationTokenHash;
        delete ret.passwordResetTokenHash;
        delete ret.twoFactorSecret;
        delete ret.twoFactorBackupCodeHashes;
        delete ret.__v;
        return ret;
      },
    },
  }
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1, status: 1 });

/**
 * `models.User` guard prevents Mongoose's "OverwriteModelError" during
 * Next.js hot-reload / repeated module evaluation in serverless functions.
 */
export const UserModel: Model<IUser> = models.User ?? model<IUser>("User", userSchema);
