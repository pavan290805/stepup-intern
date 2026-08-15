import { ROLES_REQUIRING_2FA, type Role } from "@/shared/constants/roles";

/** Admin and Super Admin accounts must have 2FA enabled before they can log in. */
export function isTwoFactorMandatory(role: Role): boolean {
  return ROLES_REQUIRING_2FA.includes(role);
}
