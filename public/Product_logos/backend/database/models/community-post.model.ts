import { Schema, model, models, type Model } from "mongoose";

export const COMMUNITY_POST_STATUSES = ["published", "hidden", "removed"] as const;
export type CommunityPostStatus = (typeof COMMUNITY_POST_STATUSES)[number];

export interface ICommunityPost {
  authorId: Schema.Types.ObjectId;
  title: string;
  content: string;
  category: string | null;
  tags: string[];
  status: CommunityPostStatus;
  likeCount: number;
  commentCount: number;
  bookmarkCount: number;
  moderatedBy: Schema.Types.ObjectId | null;
  moderationReason: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const communityPostSchema = new Schema<ICommunityPost>(
  {
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    content: { type: String, required: true },
    category: { type: String, default: null },
    tags: { type: [String], default: [] },
    status: { type: String, enum: COMMUNITY_POST_STATUSES, default: "published" },
    likeCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    bookmarkCount: { type: Number, default: 0 },
    moderatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    moderationReason: { type: String, default: null },
  },
  { timestamps: true }
);

communityPostSchema.index({ status: 1, createdAt: -1 });
communityPostSchema.index({ authorId: 1, createdAt: -1 });
communityPostSchema.index({ category: 1, status: 1 });
communityPostSchema.index({ title: "text", content: "text", tags: "text" });

export const CommunityPostModel: Model<ICommunityPost> =
  models.CommunityPost ?? model<ICommunityPost>("CommunityPost", communityPostSchema);
