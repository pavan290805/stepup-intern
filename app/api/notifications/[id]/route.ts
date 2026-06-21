import { connectDB } from '@/lib/db';
import { errorResponse, successResponse, withAuth } from '@/middleware/auth';
import { notificationService } from '@/modules/notification/notification.service';
import { NextRequest } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const authError = await withAuth(request);
    if (authError) return authError;

    const notification = await notificationService.markAsRead(params.id);

    if (!notification) {
      return errorResponse('Notification not found', undefined, 404);
    }

    return successResponse(notification, 'Notification marked as read');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to update notification', undefined, 400);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const authError = await withAuth(request);
    if (authError) return authError;

    await notificationService.deleteNotification(params.id);

    return successResponse(null, 'Notification deleted successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to delete notification', undefined, 500);
  }
}
