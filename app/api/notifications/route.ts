import { connectDB } from '@/lib/db';
import { errorResponse, successResponse, withAuth } from '@/middleware/auth';
import { notificationService } from '@/modules/notification/notification.service';
import { NextRequest } from 'next/server';

type AuthenticatedRequest = NextRequest & {
  user: {
    userId: string;
    role: string;
  };
};

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const authError = await withAuth(request);
    if (authError) return authError;

    const user = (request as AuthenticatedRequest).user;

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    const result = await notificationService.getNotifications(
      user.userId,
      {
        page,
        limit,
        unreadOnly,
      }
    );

    const unreadCount = await notificationService.getUnreadCount(
      user.userId
    );

    return successResponse({
      notifications: result.notifications,
      unreadCount,
      pagination: {
        total: result.total,
        page,
        limit,
        pages: Math.ceil(result.total / limit),
      },
    });
  } catch (error: unknown) {
    return errorResponse(
      error instanceof Error
        ? error.message
        : 'Failed to fetch notifications',
      undefined,
      500
    );
  }
}