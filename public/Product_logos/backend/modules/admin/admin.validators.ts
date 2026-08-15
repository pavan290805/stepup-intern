import { z } from "zod";
import { mongoIdSchema } from "@/shared/types/common.schemas";
import { ALL_ROLES } from "@/shared/constants/roles";
import { USER_STATUS } from "@/shared/constants/roles";

export const listUsersQuerySchema = z.object({
  role: z.enum(ALL_ROLES as [string, ...string[]]).optional(),
  status: z.enum(Object.values(USER_STATUS) as [string, ...string[]]).optional(),
  q: z.string().max(200).optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;

export const updateUserStatusSchema = z.object({
  status: z.enum(["pending", "active", "suspended", "banned"]),
  reason: z.string().max(500).optional(),
});

export type UpdateUserStatusDto = z.infer<typeof updateUserStatusSchema>;

export const updateUserRoleSchema = z.object({
  role: z.enum(ALL_ROLES as [string, ...string[]]),
});

export type UpdateUserRoleDto = z.infer<typeof updateUserRoleSchema>;

export const bulkUserActionSchema = z.object({
  userIds: z.array(mongoIdSchema).min(1).max(200),
  action: z.enum(["approve", "suspend", "ban", "activate"]),
});

export type BulkUserActionDto = z.infer<typeof bulkUserActionSchema>;

export const moderateContentSchema = z.object({
  status: z.enum(["published", "hidden", "removed"]).or(z.enum(["draft", "published", "cancelled", "archived"])),
  reason: z.string().max(500).optional(),
});

export type ModerateContentDto = z.infer<typeof moderateContentSchema>;

export const auditLogQuerySchema = z.object({
  actorId: mongoIdSchema.optional(),
  targetType: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export type AuditLogQuery = z.infer<typeof auditLogQuerySchema>;

export const reportsQuerySchema = z.object({
  sinceDays: z.coerce.number().int().min(1).max(365).default(30),
});

export type ReportsQuery = z.infer<typeof reportsQuerySchema>;

export const exportUsersQuerySchema = z.object({
  role: z.enum(ALL_ROLES as [string, ...string[]]).optional(),
});

export type ExportUsersQuery = z.infer<typeof exportUsersQuerySchema>;
