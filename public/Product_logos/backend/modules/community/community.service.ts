import { postRepository, commentRepository, likeRepository, bookmarkRepository } from "@/modules/community/community.repository";
import { eventBus } from "@/events/event-bus";
import { EVENT_NAMES } from "@/shared/constants/event-names";
import { ForbiddenError, NotFoundError } from "@/shared/errors";
import { buildPaginatedResult } from "@/shared/response/pagination";
import type {
  CreateCommentDto,
  CreatePostDto,
  ModeratePostDto,
  PostSearchQuery,
  UpdatePostDto,
} from "@/modules/community/community.validators";

function assertVisible(post: { status: string } | null) {
  if (!post || post.status === "removed") {
    throw new NotFoundError("Post not found");
  }
  return post;
}

export const communityService = {
  async createPost(authorId: string, data: CreatePostDto) {
    return postRepository.create(authorId, data);
  },

  async updatePost(postId: string, authorId: string, data: UpdatePostDto) {
    const post = await postRepository.findById(postId);
    if (!post || String(post.authorId) !== authorId) {
      throw new ForbiddenError("You do not have access to this post");
    }
    return postRepository.update(postId, data);
  },

  async deletePost(postId: string, authorId: string) {
    const post = await postRepository.findById(postId);
    if (!post || String(post.authorId) !== authorId) {
      throw new ForbiddenError("You do not have access to this post");
    }
    return postRepository.delete(postId);
  },

  async moderatePost(postId: string, moderatorId: string, data: ModeratePostDto) {
    const post = await postRepository.findById(postId);
    if (!post) {
      throw new NotFoundError("Post not found");
    }
    return postRepository.moderate(postId, data.status, moderatorId, data.reason);
  },

  async getPost(postId: string) {
    const post = await postRepository.findById(postId);
    return assertVisible(post);
  },

  async search(query: PostSearchQuery) {
    const results = await postRepository.search(
      { category: query.category, tag: query.tag, textQuery: query.q },
      query.cursor,
      query.limit
    );
    return buildPaginatedResult(results, query.limit);
  },

  async addComment(postId: string, authorId: string, data: CreateCommentDto) {
    const post = await postRepository.findById(postId);
    assertVisible(post);

    if (data.parentCommentId) {
      const parent = await commentRepository.findById(data.parentCommentId);
      if (!parent || String(parent.postId) !== postId) {
        throw new NotFoundError("Parent comment not found");
      }
    }

    const comment = await commentRepository.create(postId, authorId, data);
    await postRepository.incrementCommentCount(postId, 1);

    if (data.parentCommentId) {
      await commentRepository.incrementReplyCount(data.parentCommentId, 1);
      eventBus.publish(EVENT_NAMES.COMMUNITY_REPLY_CREATED, {
        postId,
        commentId: String(comment._id),
        authorId,
        postAuthorId: String(post!.authorId),
      });
    } else {
      eventBus.publish(EVENT_NAMES.COMMUNITY_COMMENT_CREATED, {
        postId,
        commentId: String(comment._id),
        authorId,
        postAuthorId: String(post!.authorId),
      });
    }

    return comment;
  },

  async deleteComment(commentId: string, authorId: string) {
    const comment = await commentRepository.findById(commentId);
    if (!comment || String(comment.authorId) !== authorId) {
      throw new ForbiddenError("You do not have access to this comment");
    }
    await commentRepository.delete(commentId);
    await postRepository.incrementCommentCount(String(comment.postId), -1);
    return { deleted: true };
  },

  async getComments(postId: string, cursor: string | undefined, limit: number) {
    const results = await commentRepository.findByPost(postId, cursor, limit);
    return buildPaginatedResult(results, limit);
  },

  async getReplies(commentId: string, cursor: string | undefined, limit: number) {
    const results = await commentRepository.findReplies(commentId, cursor, limit);
    return buildPaginatedResult(results, limit);
  },

  async toggleLike(userId: string, targetType: "post" | "comment", targetId: string) {
    const existing = await likeRepository.find(userId, targetType, targetId);

    if (existing) {
      await likeRepository.remove(userId, targetType, targetId);
      if (targetType === "post") await postRepository.incrementLikeCount(targetId, -1);
      else await commentRepository.incrementLikeCount(targetId, -1);
      return { liked: false };
    }

    await likeRepository.create(userId, targetType, targetId);
    if (targetType === "post") await postRepository.incrementLikeCount(targetId, 1);
    else await commentRepository.incrementLikeCount(targetId, 1);

    let targetOwnerId = "";
    if (targetType === "post") {
      const post = await postRepository.findById(targetId);
      targetOwnerId = post ? String(post.authorId) : "";
    } else {
      const comment = await commentRepository.findById(targetId);
      targetOwnerId = comment ? String(comment.authorId) : "";
    }

    eventBus.publish(EVENT_NAMES.COMMUNITY_LIKE_CREATED, {
      targetType,
      targetId,
      likedByUserId: userId,
      targetOwnerId,
    });

    return { liked: true };
  },

  async toggleBookmark(userId: string, postId: string) {
    const post = await postRepository.findById(postId);
    assertVisible(post);

    const existing = await bookmarkRepository.find(userId, postId);
    if (existing) {
      await bookmarkRepository.remove(userId, postId);
      await postRepository.incrementBookmarkCount(postId, -1);
      return { bookmarked: false };
    }

    await bookmarkRepository.create(userId, postId);
    await postRepository.incrementBookmarkCount(postId, 1);
    return { bookmarked: true };
  },

  async getBookmarks(userId: string, cursor: string | undefined, limit: number) {
    const results = await bookmarkRepository.findByUser(userId, cursor, limit);
    return buildPaginatedResult(results, limit);
  },
};

export type CommunityService = typeof communityService;
