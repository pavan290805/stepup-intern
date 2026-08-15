import type { NextRequest } from "next/server";
import { authService } from "@/modules/auth/auth.service";
import {
  confirmTwoFactorSchema,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "@/modules/auth/auth.validators";
import { ApiResponse } from "@/shared/response/api-response";
import { HTTP_STATUS } from "@/shared/constants/http-status";
import { COOKIE_NAMES, REFRESH_COOKIE_MAX_AGE_SECONDS, SESSION_COOKIE_MAX_AGE_SECONDS } from "@/shared/constants/cookies";
import { UnauthorizedError, ValidationError } from "@/shared/errors";
import { parseJsonBody } from "@/shared/utils/request";
import { env } from "@/config/env";
import type { AuthenticatedUser } from "@/modules/auth/auth.types";
import type { Role } from "@/shared/constants/roles";

function getClientIp(request: NextRequest): string | null {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim() ?? null;
  return request.headers.get("x-real-ip");
}

const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export const authController = {
  async register(request: NextRequest) {
    const body = await parseJsonBody(request);
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError("Invalid registration payload", parsed.error.flatten());
    }

    const { email, password, role } = parsed.data;
    const result = await authService.register({ email, password, role: role as Role });

    // Phase 1 note: the raw verification token is included in the response
    // only until the Email module (Phase-adjacent, queued via Resend) is
    // wired up. It must be removed from the response body once emails are
    // dispatched for real — see modules/auth/auth.controller.ts TODO tracker
    // in the project board, not in code.
    return ApiResponse.created(
      { userId: result.userId, verificationToken: result.verificationToken },
      "Registration successful. Please verify your email before logging in.",
    );
  },

  async login(request: NextRequest) {
    const body = await parseJsonBody(request);
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError("Invalid login payload", parsed.error.flatten());
    }

    const ipAddress = getClientIp(request);
    const result = await authService.login({ ...parsed.data, ipAddress });

    if (result.requiresTwoFactor) {
      return ApiResponse.success(
        { requiresTwoFactor: true, user: { email: result.user.email } },
        "Two-factor authentication code required",
        HTTP_STATUS.OK
      );
    }

    const response = ApiResponse.success<{ user: AuthenticatedUser }>(
      { user: result.user },
      "Login successful"
    );

    if (result.sessionToken && result.refreshToken) {
      response.cookies.set(COOKIE_NAMES.SESSION, result.sessionToken, {
        ...cookieOptions,
        maxAge: SESSION_COOKIE_MAX_AGE_SECONDS,
      });
      response.cookies.set(COOKIE_NAMES.REFRESH, result.refreshToken, {
        ...cookieOptions,
        maxAge: REFRESH_COOKIE_MAX_AGE_SECONDS,
      });
    }

    return response;
  },

  async logout(request: NextRequest) {
    const sessionToken = request.cookies.get(COOKIE_NAMES.SESSION)?.value;
    if (sessionToken) {
      await authService.logout(sessionToken);
    }

    const response = ApiResponse.success(null, "Logged out successfully");
    response.cookies.delete(COOKIE_NAMES.SESSION);
    response.cookies.delete(COOKIE_NAMES.REFRESH);
    return response;
  },

  async refresh(request: NextRequest) {
    const refreshToken = request.cookies.get(COOKIE_NAMES.REFRESH)?.value;
    if (!refreshToken) {
      throw new UnauthorizedError("No refresh token provided");
    }

    const { sessionToken, refreshToken: newRefreshToken } = await authService.refreshSession(refreshToken);

    const response = ApiResponse.success(null, "Session refreshed");
    response.cookies.set(COOKIE_NAMES.SESSION, sessionToken, {
      ...cookieOptions,
      maxAge: SESSION_COOKIE_MAX_AGE_SECONDS,
    });
    response.cookies.set(COOKIE_NAMES.REFRESH, newRefreshToken, {
      ...cookieOptions,
      maxAge: REFRESH_COOKIE_MAX_AGE_SECONDS,
    });
    return response;
  },

  async verifyEmail(request: NextRequest) {
    const body = await parseJsonBody(request);
    const parsed = verifyEmailSchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError("Invalid verification payload", parsed.error.flatten());
    }

    await authService.verifyEmail(parsed.data.token);
    return ApiResponse.success(null, "Email verified successfully. You may now log in.");
  },

  async forgotPassword(request: NextRequest) {
    const body = await parseJsonBody(request);
    const parsed = forgotPasswordSchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError("Invalid payload", parsed.error.flatten());
    }

    const result = await authService.forgotPassword(parsed.data.email);

    // Always return the same generic message, whether or not the account
    // exists, to prevent user enumeration.
    return ApiResponse.success(
      env.NODE_ENV === "production" ? null : { resetToken: result?.resetToken ?? null },
      "If an account with that email exists, a password reset link has been sent."
    );
  },

  async resetPassword(request: NextRequest) {
    const body = await parseJsonBody(request);
    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError("Invalid payload", parsed.error.flatten());
    }

    await authService.resetPassword(parsed.data.token, parsed.data.password);
    return ApiResponse.success(null, "Password reset successfully. Please log in with your new password.");
  },

  async initiateTwoFactor(userId: string) {
    const result = await authService.initiateTwoFactorEnrollment(userId);
    return ApiResponse.success(result, "Scan the QR code with your authenticator app, then verify a code to enable 2FA.");
  },

  async confirmTwoFactor(request: NextRequest, userId: string) {
    const body = await parseJsonBody(request);
    const parsed = confirmTwoFactorSchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError("Invalid payload", parsed.error.flatten());
    }

    const result = await authService.confirmTwoFactorEnrollment(userId, parsed.data.secret, parsed.data.code);
    return ApiResponse.success(result, "Two-factor authentication enabled. Store your backup codes securely.");
  },

  async disableTwoFactor(userId: string, role: Role) {
    await authService.disableTwoFactor(userId, role);
    return ApiResponse.success(null, "Two-factor authentication disabled.");
  },
};
