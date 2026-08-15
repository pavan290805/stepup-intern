import { z } from "zod";
import { mongoIdSchema } from "@/shared/types/common.schemas";

export const createPostSchema = z.object({
  title: z.string().min(3).max(200),
  content: z.string().min(10).max(20_000),
  category: z.string().max(100).optional(),
  tags: z.array(z.string().min(1)).max(20).default([]),
});

export type CreatePostDto = z.infer<typeof createPostSchema>;

export const updatePostSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  content: z.string().min(10).max(20_000).optional(),
  category: z.string().max(100).optional(),
  tags: z.array(z.string().min(1)).max(20).optional(),
});

export type UpdatePostDto = z.infer<typeof updatePostSchema>;

export const postSearchQuerySchema = z.object({
  q: z.string().trim().max(200).optional(),
  category: z.string().max(100).optional(),
  tag: z.string().max(50).optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type PostSearchQuery = z.infer<typeof postSearchQuerySchema>;

export const createCommentSchema = z.object({
  content: z.string().min(1).max(5000),
  parentCommentId: mongoIdSchema.optional(),
});

export type CreateCommentDto = z.infer<typeof createCommentSchema>;

export const commentListQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type CommentListQuery = z.infer<typeof commentListQuerySchema>;

export const moderatePostSchema = z.object({
  status: z.enum(["published", "hidden", "removed"]),
  reason: z.string().max(500).optional(),
});

export type ModeratePostDto = z.infer<typeof moderatePostSchema>;
