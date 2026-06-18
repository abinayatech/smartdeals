import * as cart from "@/lib/cart-service";
import * as favorites from "@/lib/favorites-service";
import * as orders from "@/lib/orders-service";
import * as notifications from "@/lib/notifications-service";
import { products, stores, getProductById } from "@/lib/mock-data";
import { wrapApi } from "./mock-client";

export const cartApi = {
  get: () => wrapApi(() => cart.getCart()),
  add: (productId: string, qty = 1) => {
    const p = getProductById(productId);
    if (!p) throw new Error("Product not found");
    return wrapApi(() => cart.addToCart(p, qty));
  },
  remove: (id: string) => wrapApi(() => cart.removeFromCart(id)),
  updateQty: (id: string, qty: number) => wrapApi(() => cart.updateCartQty(id, qty)),
  clear: () => wrapApi(() => cart.clearCart()),
};

export const favoritesApi = {
  list: () => wrapApi(() => favorites.getFavorites()),
  toggle: (id: string) => wrapApi(() => favorites.toggleFavorite(id)),
};

export const ordersApi = {
  list: (userId?: string) => wrapApi(() => orders.getOrders(userId)),
  get: (id: string) => wrapApi(() => orders.getOrderById(id)),
};

export const notificationsApi = {
  list: (userId?: string) => wrapApi(() => notifications.getNotifications(userId)),
  markRead: (id: string) => wrapApi(() => notifications.markAsRead(id)),
  delete: (id: string) => wrapApi(() => notifications.deleteNotification(id)),
};

export const catalogApi = {
  products: () => wrapApi(() => products),
  stores: () => wrapApi(() => stores),
  product: (id: string) => wrapApi(() => getProductById(id)),
};
