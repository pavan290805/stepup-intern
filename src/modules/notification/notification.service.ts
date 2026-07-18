import Notification, { INotification } from '@/models/Notification';
import { PaginationQuery } from '@/types';

export const notificationService = {
  async createNotification(
    userId: string,
    data: { title: string; message: string; type: string; relatedId?: string }
  ): Promise<INotification> {
    return Notification.create({
      userId,
      ...data,
    });
  },

  async getNotifications(
    userId: string,
    query: PaginationQuery & { unreadOnly?: boolean }
  ): Promise<{ notifications: INotification[]; total: number }> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const filter: any = { userId };

    if (query.unreadOnly) {
      filter.isRead = false;
    }

    const notifications = await Notification.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Notification.countDocuments(filter);

    return { notifications, total };
  },

  async markAsRead(notificationId: string): Promise<INotification | null> {
    return Notification.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
  },

  async markAllAsRead(userId: string): Promise<void> {
    await Notification.updateMany({ userId, isRead: false }, { isRead: true });
  },

  async deleteNotification(notificationId: string): Promise<void> {
    await Notification.findByIdAndDelete(notificationId);
  },

  async getUnreadCount(userId: string): Promise<number> {
    return Notification.countDocuments({ userId, isRead: false });
  },

  async deleteAllNotifications(userId: string): Promise<void> {
    await Notification.deleteMany({ userId });
  },
};
