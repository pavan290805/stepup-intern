import { CommunityPostModel, type CommunityPostStatus } from "@/database/models/community-post.model";
import { CommunityCommentModel } from "@/database/models/community-comment.model";
import { CommunityLikeModel, type LikeTargetType } from "@/database/models/community-like.model";
import { CommunityBookmarkModel } from "@/database/models/community-bookmark.model";
import type { CreateCommentDto, CreatePostDto, UpdatePostDto } from "@/modules/community/community.validators";

export const postRepository = {
  async create(authorId: string, data: CreatePostDto) {
    const post = await CommunityPostModel.create({ ...data, authorId, status: "published" });
    return post.toObject();
  },

  async findById(id: string) {
    return CommunityPostModel.findById(id).lean().exec();
  },

  async update(id: string, data: UpdatePostDto) {
    return CommunityPostModel.findByIdAndUpdate(id, data, { new: true }).lean().exec();
  },

  async delete(id: string) {
    return CommunityPostModel.findByIdAndDelete(id).lean().exec();
  },

  async moderate(id: string, status: CommunityPostStatus, moderatorId: string, reason?: string) {
    return CommunityPostModel.findByIdAndUpdate(
      id,
      { status, moderatedBy: moderatorId, moderationReason: reason ?? null },
      { new: true }
    )
      .lean()
      .exec();
  },

  async search(
    filters: { category?: string; tag?: string; textQuery?: string },
    cursor: string | undefined,
    limit: number
  ) {
    const query: Record<string, unknown> = { status: "published" };
    if (filters.category) query.category = filters.category;
    if (filters.tag) query.tags = filters.tag;
    if (filters.textQuery) query.$text = { $search: filters.textQuery };
    if (cursor) query._id = { $lt: cursor };

    return CommunityPostModel.find(query)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .lean()
      .exec();
  },

  async incrementLikeCount(id: string, delta: 1 | -1) {
    await CommunityPostModel.updateOne({ _id: id }, { $inc: { likeCount: delta } }).exec();
  },

  async incrementCommentCount(id: string, delta: 1 | -1) {
    await CommunityPostModel.updateOne({ _id: id }, { $inc: { commentCount: delta } }).exec();
  },

  async incrementBookmarkCount(id: string, delta: 1 | -1) {
    await CommunityPostModel.updateOne({ _id: id }, { $inc: { bookmarkCount: delta } }).exec();
  },
};

export const commentRepository = {
  async create(postId: string, authorId: string, data: CreateCommentDto) {
    const comment = await CommunityCommentModel.create({
      postId,
      authorId,
      content: data.content,
      parentCommentId: data.parentCommentId ?? null,
    });
    return comment.toObject();
  },

  async findById(id: string) {
    return CommunityCommentModel.findById(id).lean().exec();
  },

  async delete(id: string) {
    return CommunityCommentModel.findByIdAndDelete(id).lean().exec();
  },

  async incrementLikeCount(id: string, delta: 1 | -1) {
    await CommunityCommentModel.updateOne({ _id: id }, { $inc: { likeCount: delta } }).exec();
  },

  async incrementReplyCount(id: string, delta: 1 | -1) {
    await CommunityCommentModel.updateOne({ _id: id }, { $inc: { replyCount: delta } }).exec();
  },

  async findByPost(postId: string, cursor: string | undefined, limit: number) {
    const query: Record<string, unknown> = { postId, parentCommentId: null };
    if (cursor) query._id = { $lt: cursor };

    return CommunityCommentModel.find(query)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .lean()
      .exec();
  },

  async findReplies(parentCommentId: string, cursor: string | undefined, limit: number) {
    const query: Record<string, unknown> = { parentCommentId };
    if (cursor) query._id = { $lt: cursor };

    return CommunityCommentModel.find(query)
      .sort({ _id: 1 })
      .limit(limit + 1)
      .lean()
      .exec();
  },
};

export const likeRepository = {
  async create(userId: string, targetType: LikeTargetType, targetId: string) {
    const like = await CommunityLikeModel.create({ userId, targetType, targetId });
    return like.toObject();
  },

  async find(userId: string, targetType: LikeTargetType, targetId: string) {
    return CommunityLikeModel.findOne({ userId, targetType, targetId }).lean().exec();
  },

  async remove(userId: string, targetType: LikeTargetType, targetId: string) {
    return CommunityLikeModel.findOneAndDelete({ userId, targetType, targetId }).lean().exec();
  },
};

export const bookmarkRepository = {
  async create(userId: string, postId: string) {
    const bookmark = await CommunityBookmarkModel.create({ userId, postId });
    return bookmark.toObject();
  },

  async find(userId: string, postId: string) {
    return CommunityBookmarkModel.findOne({ userId, postId }).lean().exec();
  },

  async remove(userId: string, postId: string) {
    return CommunityBookmarkModel.findOneAndDelete({ userId, postId }).lean().exec();
  },

  async findByUser(userId: string, cursor: string | undefined, limit: number) {
    const query: Record<string, unknown> = { userId };
    if (cursor) query._id = { $lt: cursor };

    return CommunityBookmarkModel.find(query)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .lean()
      .exec();
  },
};

export type PostRepository = typeof postRepository;
export type CommentRepository = typeof commentRepository;
export type LikeRepository = typeof likeRepository;
export type BookmarkRepository = typeof bookmarkRepository;
