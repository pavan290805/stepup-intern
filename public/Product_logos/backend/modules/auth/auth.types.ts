import type { Role, UserStatus } from "@/shared/constants/roles";

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: Role;
  status: UserStatus;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
}

export interface RegisterInput {
  email: string;
  password: string;
  role: Role;
}

export interface LoginInput {
  email: string;
  password: string;
  ipAddress: string | null;
  twoFactorCode?: string;
}

export interface LoginResult {
  user: AuthenticatedUser;
  requiresTwoFactor: boolean;
  sessionToken: string | null;
}

export interface TokenPair {
  rawToken: string;
  tokenHash: string;
  expiresAt: Date;
}
