import { UserModel, type IUser } from "@/database/models/user.model";
import { SessionModel } from "@/database/models/session.model";
import type { Role } from "@/shared/constants/roles";

export interface CreateUserData {
  email: string;
  passwordHash: string;
  role: Role;
  emailVerificationTokenHash: string;
  emailVerificationExpiresAt: Date;
}

/**
 * Repository layer: the only module allowed to import `UserModel` directly.
 * All methods return plain lean objects (never live Mongoose documents) so
 * the service layer stays decoupled from the ODM.
 */
export const authRepository = {
  async createUser(data: CreateUserData): Promise<IUser & { _id: unknown }> {
    const user = await UserModel.create(data);
    return user.toObject();
  },

  async findByEmail(email: string, includeSecrets = false) {
    const query = UserModel.findOne({ email: email.toLowerCase() });
    if (includeSecrets) {
      query.select(
        "+passwordHash +emailVerificationTokenHash +emailVerificationExpiresAt +passwordResetTokenHash +passwordResetExpiresAt +twoFactorSecret +twoFactorBackupCodeHashes"
      );
    }
    return query.lean().exec();
  },

  async findById(id: string) {
    return UserModel.findById(id).lean().exec();
  },

  async findByEmailVerificationTokenHash(tokenHash: string) {
    return UserModel.findOne({ emailVerificationTokenHash: tokenHash })
      .select("+emailVerificationTokenHash +emailVerificationExpiresAt")
      .lean()
      .exec();
  },

  async findByPasswordResetTokenHash(tokenHash: string) {
    return UserModel.findOne({ passwordResetTokenHash: tokenHash })
      .select("+passwordResetTokenHash +passwordResetExpiresAt")
      .lean()
      .exec();
  },

  async markEmailVerified(userId: string) {
    return UserModel.findByIdAndUpdate(
      userId,
      {
        emailVerified: true,
        status: "active",
        emailVerificationTokenHash: null,
        emailVerificationExpiresAt: null,
      },
      { new: true }
    )
      .lean()
      .exec();
  },

  async setEmailVerificationToken(userId: string, tokenHash: string, expiresAt: Date) {
    return UserModel.findByIdAndUpdate(
      userId,
      { emailVerificationTokenHash: tokenHash, emailVerificationExpiresAt: expiresAt },
      { new: true }
    )
      .lean()
      .exec();
  },

  async setPasswordResetToken(userId: string, tokenHash: string, expiresAt: Date) {
    return UserModel.findByIdAndUpdate(
      userId,
      { passwordResetTokenHash: tokenHash, passwordResetExpiresAt: expiresAt },
      { new: true }
    )
      .lean()
      .exec();
  },

  async resetPassword(userId: string, passwordHash: string) {
    return UserModel.findByIdAndUpdate(
      userId,
      {
        passwordHash,
        passwordResetTokenHash: null,
        passwordResetExpiresAt: null,
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
      { new: true }
    )
      .lean()
      .exec();
  },

  async recordFailedLoginAttempt(userId: string, attempts: number, lockedUntil: Date | null) {
    return UserModel.findByIdAndUpdate(
      userId,
      { failedLoginAttempts: attempts, lockedUntil },
      { new: true }
    )
      .lean()
      .exec();
  },

  async recordSuccessfulLogin(userId: string, ipAddress: string | null) {
    return UserModel.findByIdAndUpdate(
      userId,
      { failedLoginAttempts: 0, lockedUntil: null, lastLoginAt: new Date(), lastLoginIp: ipAddress },
      { new: true }
    )
      .lean()
      .exec();
  },

  async enableTwoFactor(userId: string, secret: string, backupCodeHashes: string[]) {
    return UserModel.findByIdAndUpdate(
      userId,
      { twoFactorEnabled: true, twoFactorSecret: secret, twoFactorBackupCodeHashes: backupCodeHashes },
      { new: true }
    )
      .lean()
      .exec();
  },

  async disableTwoFactor(userId: string) {
    return UserModel.findByIdAndUpdate(
      userId,
      { twoFactorEnabled: false, twoFactorSecret: null, twoFactorBackupCodeHashes: [] },
      { new: true }
    )
      .lean()
      .exec();
  },

  async consumeBackupCode(userId: string, remainingHashes: string[]) {
    return UserModel.findByIdAndUpdate(userId, { twoFactorBackupCodeHashes: remainingHashes }, { new: true })
      .lean()
      .exec();
  },

  /** Admin-facing: list/filter/search users across all roles, cursor-paginated. */
  async listUsers(
    filters: { role?: string; status?: string; q?: string },
    cursor: string | undefined,
    limit: number
  ) {
    const query: Record<string, unknown> = {};
    if (filters.role) query.role = filters.role;
    if (filters.status) query.status = filters.status;
    if (filters.q) query.email = { $regex: filters.q, $options: "i" };
    if (cursor) query._id = { $lt: cursor };

    return UserModel.find(query)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .lean()
      .exec();
  },

  async countByRoleAndStatus(): Promise<{ role: string; status: string; count: number }[]> {
    const results = await UserModel.aggregate([
      { $group: { _id: { role: "$role", status: "$status" }, count: { $sum: 1 } } },
    ]).exec();

    return results.map((entry) => ({ role: entry._id.role, status: entry._id.status, count: entry.count }));
  },

  async adminUpdateStatus(userId: string, status: "pending" | "active" | "suspended" | "banned") {
    return UserModel.findByIdAndUpdate(userId, { status }, { new: true }).lean().exec();
  },

  async adminUpdateRole(userId: string, role: string) {
    return UserModel.findByIdAndUpdate(userId, { role }, { new: true }).lean().exec();
  },
};

export const sessionRepository = {
  async create(data: {
    userId: string;
    sessionTokenHash: string;
    refreshTokenHash: string;
    ipAddress: string | null;
    userAgent: string | null;
    expiresAt: Date;
    refreshExpiresAt: Date;
  }) {
    const session = await SessionModel.create(data);
    return session.toObject();
  },

  async findBySessionTokenHash(sessionTokenHash: string) {
    return SessionModel.findOne({ sessionTokenHash, revokedAt: null }).lean().exec();
  },

  async findByRefreshTokenHash(refreshTokenHash: string) {
    return SessionModel.findOne({ refreshTokenHash, revokedAt: null }).lean().exec();
  },

  async rotate(
    sessionId: string,
    data: { sessionTokenHash: string; refreshTokenHash: string; expiresAt: Date; refreshExpiresAt: Date }
  ) {
    return SessionModel.findByIdAndUpdate(sessionId, data, { new: true }).lean().exec();
  },

  async revokeById(sessionId: string) {
    return SessionModel.findByIdAndUpdate(sessionId, { revokedAt: new Date() }, { new: true }).lean().exec();
  },

  async revokeBySessionTokenHash(sessionTokenHash: string) {
    return SessionModel.findOneAndUpdate(
      { sessionTokenHash },
      { revokedAt: new Date() },
      { new: true }
    )
      .lean()
      .exec();
  },

  async revokeAllForUser(userId: string) {
    return SessionModel.updateMany({ userId, revokedAt: null }, { revokedAt: new Date() }).exec();
  },
};

export type AuthRepository = typeof authRepository;
