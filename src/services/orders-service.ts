import type { Order, OrderStatus } from "@/models";
import { seedOrders } from "@/lib/mock-data";
import { LEGACY_KEYS, migrateLegacyToUser, readJSON, writeJSON, writeUserTable } from "@/utils/storage";
import { getCurrentUserId, requireUserId } from "@/utils/user-context";

export const ORDER_STATUSES: OrderStatus[] = [
  "Placed",
  "Confirmed",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

function userOrders(userId: string): Order[] {
  return migrateLegacyToUser(userId, "orders", LEGACY_KEYS.orders, []);
}

function allUserOrdersFlat(): Order[] {
  if (typeof window === "undefined") return [...seedOrders];
  const global = readJSON<Order[]>(LEGACY_KEYS.orders, []);
  return [...global, ...seedOrders];
}

export function getOrders(userId?: string): Order[] {
  const id = userId ?? getCurrentUserId();
  if (!id) return allUserOrdersFlat();
  const mine = userOrders(id);
  if (mine.length > 0) return mine.sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime());
  if (id === "demo-1" || id === "admin-1") {
    return seedOrders.slice(0, 10).map((o) => ({ ...o, userId: id }));
  }
  return seedOrders.filter((o) => o.userId === id).slice(0, 20);
}

export function getOrderById(orderId: string, userId?: string): Order | undefined {
  return getOrders(userId).find((o) => o.id === orderId);
}

export function saveOrder(order: Order) {
  const id = order.userId || requireUserId();
  const orders = userOrders(id);
  orders.unshift(order);
  writeUserTable(id, "orders", orders);
  return order;
}

export function createOrderId(): string {
  return `SD-${10000 + Math.floor(Math.random() * 90000)}${Date.now().toString(36).toUpperCase().slice(-4)}`;
}

export function statusIndex(status: OrderStatus): number {
  return ORDER_STATUSES.indexOf(status);
}

export function updateOrderStatus(orderId: string, status: OrderStatus) {
  const all = readJSON<Order[]>(LEGACY_KEYS.orders, []);
  const idx = all.findIndex((o) => o.id === orderId);
  if (idx >= 0) {
    all[idx].status = status;
    writeJSON(LEGACY_KEYS.orders, all);
  }
  for (const userId of [getCurrentUserId()].filter(Boolean) as string[]) {
    const orders = userOrders(userId);
    const uidx = orders.findIndex((o) => o.id === orderId);
    if (uidx >= 0) {
      orders[uidx].status = status;
      writeUserTable(userId, "orders", orders);
    }
  }
}

export function getUserOrderStats(userId: string) {
  const orders = getOrders(userId);
  const delivered = orders.filter((o) => o.status === "Delivered");
  return {
    count: orders.length,
    totalSpent: delivered.reduce((s, o) => s + o.total, 0),
    totalSaved: delivered.reduce((s, o) => s + o.discount, 0),
  };
}
