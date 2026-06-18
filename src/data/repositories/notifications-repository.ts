import * as notificationsService from "@/lib/notifications-service";

export const notificationsRepository = {
  getAll: (userId?: string) => notificationsService.getNotifications(userId),
  markRead: (id: string) => notificationsService.markAsRead(id),
  delete: (id: string) => notificationsService.deleteNotification(id),
  unreadCount: (userId: string) => notificationsService.unreadCount(userId),
};
