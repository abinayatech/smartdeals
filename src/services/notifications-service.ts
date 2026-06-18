import type { Notification } from "@/models";
import { seedNotifications } from "@/lib/mock-data";
import { LEGACY_KEYS, migrateLegacyToUser, writeUserTable } from "@/utils/storage";
import { getCurrentUserId, requireUserId } from "@/utils/user-context";

function userNotifications(userId: string): Notification[] {
  return migrateLegacyToUser(userId, "notifications", LEGACY_KEYS.notifications, []);
}

export function getNotifications(userId?: string): Notification[] {
  const id = userId ?? getCurrentUserId();
  if (!id) {
    return [...seedNotifications].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  const mine = [...userNotifications(id), ...seedNotifications.filter((n) => n.userId === id)];
  if (mine.length > 0) return mine.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  if (id === "demo-1" || id === "admin-1") {
    return seedNotifications.slice(0, 12).map((n) => ({ ...n, userId: id }));
  }
  return [];
}

export function addNotification(notif: Notification) {
  const id = notif.userId || requireUserId();
  const list = userNotifications(id);
  list.unshift(notif);
  writeUserTable(id, "notifications", list);
}

export function markAsRead(notifId: string) {
  const id = requireUserId();
  const list = userNotifications(id).map((n) => (n.id === notifId ? { ...n, read: true } : n));
  writeUserTable(id, "notifications", list);
  return list;
}

export function markAllAsRead(userId: string) {
  const list = userNotifications(userId).map((n) => ({ ...n, read: true }));
  writeUserTable(userId, "notifications", list);
}

export function deleteNotification(notifId: string) {
  const id = requireUserId();
  const list = userNotifications(id).filter((n) => n.id !== notifId);
  writeUserTable(id, "notifications", list);
  return list;
}

export function unreadCount(userId: string): number {
  return getNotifications(userId).filter((n) => !n.read).length;
}

export function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}
