import { eventBus } from "@/events/event-bus";
import { EVENT_NAMES } from "@/shared/constants/event-names";
import { createModuleLogger } from "@/config/logger.config";

const logger = createModuleLogger("listener:community-activity");

export interface CommunityCommentCreatedPayload {
  postId: string;
  commentId: string;
  authorId: string;
  postAuthorId: string;
}

export interface CommunityLikeCreatedPayload {
  targetType: "post" | "comment";
  targetId: string;
  likedByUserId: string;
  targetOwnerId: string;
}

/** Architecture-only: see on-event-registration.listener.ts for rationale. */
export function registerCommunityListeners(): void {
  eventBus.on(EVENT_NAMES.COMMUNITY_COMMENT_CREATED, (payload: CommunityCommentCreatedPayload) => {
    logger.info({ payload }, "Would notify post author of new comment");
  });

  eventBus.on(EVENT_NAMES.COMMUNITY_REPLY_CREATED, (payload: CommunityCommentCreatedPayload) => {
    logger.info({ payload }, "Would notify parent comment author of new reply");
  });

  eventBus.on(EVENT_NAMES.COMMUNITY_MENTION_CREATED, (payload: { mentionedUserId: string; postId: string }) => {
    logger.info({ payload }, "Would notify mentioned user");
  });

  eventBus.on(EVENT_NAMES.COMMUNITY_LIKE_CREATED, (payload: CommunityLikeCreatedPayload) => {
    logger.info({ payload }, "Would notify target owner of new like");
  });
}
