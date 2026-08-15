import { z } from "zod";
import { mongoIdSchema } from "@/shared/types/common.schemas";

export const sendMessageSchema = z.object({
  receiverId: mongoIdSchema,
  content: z.string().min(1).max(5000),
});

export type SendMessageDto = z.infer<typeof sendMessageSchema>;

export const messageListQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(30),
});

export type MessageListQuery = z.infer<typeof messageListQuerySchema>;
