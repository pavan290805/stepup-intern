import { authenticator } from "otplib";
import { nanoid } from "nanoid";
import { authRepository, sessionRepository } from "@/modules/auth/auth.repository";
import { hashPassword, verifyPassword } from "@/shared/utils/hash";
import { generateSecureToken, hashToken } from "@/shared/utils/crypto";
import { minutesFromNow, isPast } from "@/shared/utils/date";
import { env } from "@/config/env";
import { createModuleLogger } from "@/config/logger.config";
import { ConflictError, ForbiddenError, NotFoundError, UnauthorizedError, ValidationError } from "@/shared/errors";
import { isTwoFactorMandatory } from "@/modules/auth/auth.permissions";
import type { AuthenticatedUser, LoginInput, RegisterInput } from "@/modules/auth/auth.types";
import type { Role } from "@/shared/constants/roles";

const logger = createModuleLogger("auth.service");

const EMAIL_VERIFICATION_TTL_MINUTES = 60 * 24; // 24 hours
const PASSWORD_RESET_TTL_MINUTES = 15;
const SESSION_TTL_MINUTES = 60 * 24 * 7; // 7 days
const REFRESH_TTL_MINUTES = 60 * 24 * 30; // 30 days
const LOCK_BASE_MINUTES = env.ACCOUNT_LOCK_BASE_MINUTES;
const MAX_FAILED_ATTEMPTS = env.ACCOUNT_LOCK_MAX_ATTEMPTS;

function toAuthenticatedUser(user: {
  _id: unknown;
  email: string;
  role: Role;
  status: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
}): AuthenticatedUser {
  return {
    id: String(user._id),
    email: user.email,
    role: user.role,
    status: user.status as AuthenticatedUser["status"],
    emailVerified: user.emailVerified,
    twoFactorEnabled: user.twoFactorEnabled,
  };
}

/**
 * Exponential backoff lockout window, escalating 1 -> 15 -> 60 minutes as
 * described in the architecture document. Attempt count beyond the max is
 * clamped so the multiplier doesn't grow unbounded.
 */
function computeLockDuration(attemptsOverLimit: number): number {
  const schedule = [LOCK_BASE_MINUTES, 15, 60];
  const index = Math.min(attemptsOverLimit, schedule.length - 1);
  return schedule[index] ?? 60;
}

export const authService = {
  async register(input: RegisterInput): Promise<{ userId: string; verificationToken: string }> {
    const existing = await authRepository.findByEmail(input.email);
    if (existing) {
      throw new ConflictError("An account with this email already exists");
    }

    const passwordHash = await hashPassword(input.password);
    const { rawToken, tokenHash } = generateSecureToken();

    const user = await authRepository.createUser({
      email: input.email,
      passwordHash,
      role: input.role,
      emailVerificationTokenHash: tokenHash,
      emailVerificationExpiresAt: minutesFromNow(EMAIL_VERIFICATION_TTL_MINUTES),
    });

    logger.info({ userId: String(user._id), role: input.role }, "User registered");

    // The raw token is handed back to the controller, which (in a later
    // phase / via the email queue) dispatches it through Resend. We never
    // persist the raw token — only its hash — so returning it here is the
    // one and only place it exists outside the user's inbox.
    return { userId: String(user._id), verificationToken: rawToken };
  },

  async verifyEmail(rawToken: string): Promise<void> {
    const tokenHash = hashToken(rawToken);
    const user = await authRepository.findByEmailVerificationTokenHash(tokenHash);

    if (!user) {
      throw new NotFoundError("Invalid or expired verification token");
    }

    if (!user.emailVerificationExpiresAt || isPast(user.emailVerificationExpiresAt)) {
      throw new ValidationError("Verification token has expired. Please request a new one.");
    }

    await authRepository.markEmailVerified(String(user._id));
    logger.info({ userId: String(user._id) }, "Email verified");
  },

  async resendVerificationEmail(email: string): Promise<{ userId: string; verificationToken: string } | null> {
    const user = await authRepository.findByEmail(email);
    if (!user || user.emailVerified) {
      // Deliberately silent: don't reveal account existence/verification state.
      return null;
    }

    const { rawToken, tokenHash } = generateSecureToken();
    await authRepository.setEmailVerificationToken(
      String(user._id),
      tokenHash,
      minutesFromNow(EMAIL_VERIFICATION_TTL_MINUTES)
    );

    return { userId: String(user._id), verificationToken: rawToken };
  },

  async login(input: LoginInput): Promise<{
    user: AuthenticatedUser;
    requiresTwoFactor: boolean;
    sessionToken: string | null;
    refreshToken: string | null;
  }> {
    const user = await authRepository.findByEmail(input.email, true);

    // Constant-shape error regardless of whether the email exists, to avoid
    // user-enumeration via response differences.
    const invalidCredentialsError = () => new UnauthorizedError("Invalid email or password");

    if (!user) {
      throw invalidCredentialsError();
    }

    if (user.lockedUntil && !isPast(user.lockedUntil)) {
      throw new ForbiddenError(
        `Account temporarily locked due to repeated failed login attempts. Try again after ${user.lockedUntil.toISOString()}.`
      );
    }

    if (user.status === "banned" || user.status === "suspended") {
      throw new ForbiddenError("This account is not permitted to sign in. Contact support.");
    }

    const passwordValid = await verifyPassword(input.password, user.passwordHash);

    if (!passwordValid) {
      const attempts = user.failedLoginAttempts + 1;
      const lockedUntil =
        attempts >= MAX_FAILED_ATTEMPTS
          ? minutesFromNow(computeLockDuration(attempts - MAX_FAILED_ATTEMPTS))
          : null;

      await authRepository.recordFailedLoginAttempt(String(user._id), attempts, lockedUntil);
      logger.warn({ userId: String(user._id), attempts }, "Failed login attempt");
      throw invalidCredentialsError();
    }

    if (!user.emailVerified) {
      throw new ForbiddenError("Please verify your email address before logging in");
    }

    if (isTwoFactorMandatory(user.role) && !user.twoFactorEnabled) {
      throw new ForbiddenError(
        "Two-factor authentication is mandatory for this role. Please enable it before logging in."
      );
    }

    if (user.twoFactorEnabled) {
      if (!input.twoFactorCode) {
        // Signal to the controller that a second step is required; no
        // session is issued yet.
        return {
          user: toAuthenticatedUser(user),
          requiresTwoFactor: true,
          sessionToken: null,
          refreshToken: null,
        };
      }

      const validCode = user.twoFactorSecret
        ? authenticator.verify({ token: input.twoFactorCode, secret: user.twoFactorSecret })
        : false;

      if (!validCode) {
        throw new UnauthorizedError("Invalid two-factor authentication code");
      }
    }

    await authRepository.recordSuccessfulLogin(String(user._id), input.ipAddress);

    const { sessionToken, refreshToken } = await this.issueSession(String(user._id), input.ipAddress, null);

    logger.info({ userId: String(user._id) }, "User logged in");

    return {
      user: toAuthenticatedUser(user),
      requiresTwoFactor: false,
      sessionToken,
      refreshToken,
    };
  },

  async issueSession(userId: string, ipAddress: string | null, userAgent: string | null) {
    const session = generateSecureToken();
    const refresh = generateSecureToken();

    await sessionRepository.create({
      userId,
      sessionTokenHash: session.tokenHash,
      refreshTokenHash: refresh.tokenHash,
      ipAddress,
      userAgent,
      expiresAt: minutesFromNow(SESSION_TTL_MINUTES),
      refreshExpiresAt: minutesFromNow(REFRESH_TTL_MINUTES),
    });

    return { sessionToken: session.rawToken, refreshToken: refresh.rawToken };
  },

  async getSessionUser(rawSessionToken: string): Promise<AuthenticatedUser> {
    const tokenHash = hashToken(rawSessionToken);
    const session = await sessionRepository.findBySessionTokenHash(tokenHash);

    if (!session || isPast(session.expiresAt)) {
      throw new UnauthorizedError("Session expired or invalid. Please log in again.");
    }

    const user = await authRepository.findById(String(session.userId));
    if (!user) {
      throw new UnauthorizedError("Session refers to a user that no longer exists");
    }

    if (user.status === "banned" || user.status === "suspended") {
      throw new ForbiddenError("This account is not permitted to sign in. Contact support.");
    }

    return toAuthenticatedUser(user);
  },

  /** Cross-module lookup (e.g. invoice billing email) - never exposed directly via a route. */
  async getUserById(userId: string): Promise<AuthenticatedUser> {
    const user = await authRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return toAuthenticatedUser(user);
  },

  /** Rotating refresh: old refresh token is invalidated the moment a new pair is issued. */
  async refreshSession(rawRefreshToken: string) {
    const tokenHash = hashToken(rawRefreshToken);
    const session = await sessionRepository.findByRefreshTokenHash(tokenHash);

    if (!session || isPast(session.refreshExpiresAt)) {
      throw new UnauthorizedError("Refresh token expired or invalid. Please log in again.");
    }

    const newSession = generateSecureToken();
    const newRefresh = generateSecureToken();

    await sessionRepository.rotate(String(session._id), {
      sessionTokenHash: newSession.tokenHash,
      refreshTokenHash: newRefresh.tokenHash,
      expiresAt: minutesFromNow(SESSION_TTL_MINUTES),
      refreshExpiresAt: minutesFromNow(REFRESH_TTL_MINUTES),
    });

    return { sessionToken: newSession.rawToken, refreshToken: newRefresh.rawToken };
  },

  async logout(rawSessionToken: string): Promise<void> {
    const tokenHash = hashToken(rawSessionToken);
    await sessionRepository.revokeBySessionTokenHash(tokenHash);
  },

  async forgotPassword(email: string): Promise<{ userId: string; resetToken: string } | null> {
    const user = await authRepository.findByEmail(email);
    if (!user) {
      // Silent no-op: never reveal whether an email is registered.
      return null;
    }

    const { rawToken, tokenHash } = generateSecureToken();
    await authRepository.setPasswordResetToken(String(user._id), tokenHash, minutesFromNow(PASSWORD_RESET_TTL_MINUTES));

    return { userId: String(user._id), resetToken: rawToken };
  },

  async resetPassword(rawToken: string, newPassword: string): Promise<void> {
    const tokenHash = hashToken(rawToken);
    const user = await authRepository.findByPasswordResetTokenHash(tokenHash);

    if (!user) {
      throw new NotFoundError("Invalid or expired reset token");
    }

    if (!user.passwordResetExpiresAt || isPast(user.passwordResetExpiresAt)) {
      throw new ValidationError("Reset token has expired. Please request a new one.");
    }

    const passwordHash = await hashPassword(newPassword);
    await authRepository.resetPassword(String(user._id), passwordHash);

    // Resetting a password invalidates every existing session — a stolen
    // session shouldn't survive a legitimate password reset.
    await sessionRepository.revokeAllForUser(String(user._id));

    logger.info({ userId: String(user._id) }, "Password reset completed; all sessions revoked");
  },

  async initiateTwoFactorEnrollment(userId: string): Promise<{ secret: string; otpauthUrl: string }> {
    const user = await authRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(user.email, env.TWO_FACTOR_ISSUER, secret);

    // Secret is not persisted until the user proves possession by verifying
    // one code, via `confirmTwoFactorEnrollment` below.
    return { secret, otpauthUrl };
  },

  async confirmTwoFactorEnrollment(
    userId: string,
    secret: string,
    code: string
  ): Promise<{ backupCodes: string[] }> {
    const isValid = authenticator.verify({ token: code, secret });
    if (!isValid) {
      throw new ValidationError("Invalid verification code");
    }

    const backupCodes = Array.from({ length: 10 }, () => nanoid(10));
    const backupCodeHashes = backupCodes.map((code) => hashToken(code));

    await authRepository.enableTwoFactor(userId, secret, backupCodeHashes);

    return { backupCodes };
  },

  async disableTwoFactor(userId: string, role: Role): Promise<void> {
    if (isTwoFactorMandatory(role)) {
      throw new ForbiddenError("Two-factor authentication cannot be disabled for this role");
    }
    await authRepository.disableTwoFactor(userId);
  },

  /** Admin-facing operations. Never exposed to non-admin routes. */
  async adminListUsers(filters: { role?: string; status?: string; q?: string }, cursor: string | undefined, limit: number) {
    return authRepository.listUsers(filters, cursor, limit);
  },

  async adminGetUserById(userId: string) {
    const user = await authRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return user;
  },

  async adminApproveUser(userId: string) {
    const user = await authRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return authRepository.adminUpdateStatus(userId, "active");
  },

  async adminSetUserStatus(userId: string, status: "pending" | "active" | "suspended" | "banned") {
    const user = await authRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const updated = await authRepository.adminUpdateStatus(userId, status);

    if (status === "banned" || status === "suspended") {
      await sessionRepository.revokeAllForUser(userId);
    }

    return updated;
  },

  async adminUpdateUserRole(userId: string, role: Role) {
    const user = await authRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    const updated = await authRepository.adminUpdateRole(userId, role);
    await sessionRepository.revokeAllForUser(userId);
    return updated;
  },

  async adminGetUserStats() {
    return authRepository.countByRoleAndStatus();
  },
};

export type AuthService = typeof authService;
