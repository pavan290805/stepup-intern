import type { NextRequest } from "next/server";
import { communityService } from "@/modules/community/community.service";
import {
  commentListQuerySchema,
  createCommentSchema,
  createPostSchema,
  moderatePostSchema,
  postSearchQuerySchema,
  updatePostSchema,
} from "@/modules/community/community.validators";
import { ApiResponse } from "@/shared/response/api-response";
import { ValidationError } from "@/shared/errors";
import { parseJsonBody } from "@/shared/utils/request";
import type { AuthContext } from "@/middlewares/auth.middleware";

function parseQuery(request: NextRequest) {
  return Object.fromEntries(request.nextUrl.searchParams.entries());
}

export const communityController = {
  async search(request: NextRequest) {
    const parsed = postSearchQuerySchema.safeParse(parseQuery(request));
    if (!parsed.success) throw new ValidationError("Invalid query parameters", parsed.error.flatten());

    const result = await communityService.search(parsed.data);
    return ApiResponse.success(result, "Posts retrieved");
  },

  async getPost(request: NextRequest, context: { params?: Record<string, string> }) {
    const id = context.params?.id;
    if (!id) throw new ValidationError("Post id is required");

    const post = await communityService.getPost(id);
    return ApiResponse.success(post, "Post retrieved");
  },

  async createPost(request: NextRequest, context: AuthContext) {
    const body = await parseJsonBody(request);
    const parsed = createPostSchema.safeParse(body);
    if (!parsed.success) throw new ValidationError("Invalid post payload", parsed.error.flatten());

    const post = await communityService.createPost(context.user.id, parsed.data);
    return ApiResponse.created(post, "Post created");
  },

  async updatePost(request: NextRequest, context: AuthContext) {
    const id = context.params?.id;
    if (!id) throw new ValidationError("Post id is required");

    const body = await parseJsonBody(request);
    const parsed = updatePostSchema.safeParse(body);
    if (!parsed.success) throw new ValidationError("Invalid post payload", parsed.error.flatten());

    const post = await communityService.updatePost(id, context.user.id, parsed.data);
    return ApiResponse.success(post, "Post updated");
  },

  async deletePost(request: NextRequest, context: AuthContext) {
    const id = context.params?.id;
    if (!id) throw new ValidationError("Post id is required");

    await communityService.deletePost(id, context.user.id);
    return ApiResponse.success(null, "Post deleted");
  },

  async moderatePost(request: NextRequest, context: AuthContext) {
    const id = context.params?.id;
    if (!id) throw new ValidationError("Post id is required");

    const body = await parseJsonBody(request);
    const parsed = moderatePostSchema.safeParse(body);
    if (!parsed.success) throw new ValidationError("Invalid moderation payload", parsed.error.flatten());

    const post = await communityService.moderatePost(id, context.user.id, parsed.data);
    return ApiResponse.success(post, "Post moderated");
  },

  async addComment(request: NextRequest, context: AuthContext) {
    const postId = context.params?.id;
    if (!postId) throw new ValidationError("Post id is required");

    const body = await parseJsonBody(request);
    const parsed = createCommentSchema.safeParse(body);
    if (!parsed.success) throw new ValidationError("Invalid comment payload", parsed.error.flatten());

    const comment = await communityService.addComment(postId, context.user.id, parsed.data);
    return ApiResponse.created(comment, "Comment added");
  },

  async getComments(request: NextRequest, context: { params?: Record<string, string> }) {
    const postId = context.params?.id;
    if (!postId) throw new ValidationError("Post id is required");

    const parsed = commentListQuerySchema.safeParse(parseQuery(request));
    if (!parsed.success) throw new ValidationError("Invalid query parameters", parsed.error.flatten());

    const result = await communityService.getComments(postId, parsed.data.cursor, parsed.data.limit);
    return ApiResponse.success(result, "Comments retrieved");
  },

  async deleteComment(request: NextRequest, context: AuthContext) {
    const commentId = context.params?.id;
    if (!commentId) throw new ValidationError("Comment id is required");

    await communityService.deleteComment(commentId, context.user.id);
    return ApiResponse.success(null, "Comment deleted");
  },

  async likePost(request: NextRequest, context: AuthContext) {
    const postId = context.params?.id;
    if (!postId) throw new ValidationError("Post id is required");

    const result = await communityService.toggleLike(context.user.id, "post", postId);
    return ApiResponse.success(result, result.liked ? "Post liked" : "Post unliked");
  },

  async likeComment(request: NextRequest, context: AuthContext) {
    const commentId = context.params?.id;
    if (!commentId) throw new ValidationError("Comment id is required");

    const result = await communityService.toggleLike(context.user.id, "comment", commentId);
    return ApiResponse.success(result, result.liked ? "Comment liked" : "Comment unliked");
  },

  async bookmarkPost(request: NextRequest, context: AuthContext) {
    const postId = context.params?.id;
    if (!postId) throw new ValidationError("Post id is required");

    const result = await communityService.toggleBookmark(context.user.id, postId);
    return ApiResponse.success(result, result.bookmarked ? "Post bookmarked" : "Bookmark removed");
  },

  async getBookmarks(request: NextRequest, context: AuthContext) {
    const parsed = commentListQuerySchema.safeParse(parseQuery(request));
    if (!parsed.success) throw new ValidationError("Invalid query parameters", parsed.error.flatten());

    const result = await communityService.getBookmarks(context.user.id, parsed.data.cursor, parsed.data.limit);
    return ApiResponse.success(result, "Bookmarks retrieved");
  },
};
