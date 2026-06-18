import { wrapApi, apiCall } from "./mock-client";
import * as auth from "@/services/auth-service";
import * as cart from "@/services/cart-service";
import * as favorites from "@/services/favorites-service";
import * as orders from "@/services/orders-service";
import * as notifications from "@/services/notifications-service";
import * as activity from "@/services/activity-service";
import * as wishlist from "@/services/wishlist-service";
import * as savedSearch from "@/services/saved-search-service";
import * as achievements from "@/services/achievements-service";
import * as insights from "@/services/insights-service";
import * as recommendations from "@/services/recommendation-service";
import * as priceHistory from "@/services/price-history-service";
import * as database from "@/services/database-service";
import { products, stores, getProductById, categories, deals } from "@/lib/mock-data";

export const authApi = {
  signIn: (email: string, password: string) => wrapApi(() => auth.validateCredentials(email, password)),
  register: (data: Parameters<typeof auth.registerAccount>[0]) => wrapApi(() => auth.registerAccount(data)),
  session: () => wrapApi(() => auth.loadSession()),
  refresh: () => wrapApi(() => auth.refreshSessionToken()),
};

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

export const catalogApi = {
  products: () => wrapApi(() => products),
  stores: () => wrapApi(() => stores),
  categories: () => wrapApi(() => categories),
  deals: () => wrapApi(() => deals),
  product: (id: string) => wrapApi(() => getProductById(id)),
};

export const userApi = {
  activity: () => wrapApi(() => activity.getUserActivity()),
  insights: () => wrapApi(() => insights.getShoppingInsights()),
  achievements: () => wrapApi(() => achievements.getAchievements()),
  recommendations: (limit?: number) => wrapApi(() => recommendations.getPersonalizedRecommendations(undefined, limit)),
  wishlists: () => wrapApi(() => wishlist.getWishlists()),
  savedSearches: () => wrapApi(() => savedSearch.getSavedSearches()),
  priceHistory: (productId: string) => wrapApi(() => priceHistory.getPriceHistory(productId)),
};

export const ordersApi = {
  list: () => wrapApi(() => orders.getOrders()),
  get: (id: string) => wrapApi(() => orders.getOrderById(id)),
};

export const notificationsApi = {
  list: () => wrapApi(() => notifications.getNotifications()),
  markRead: (id: string) => wrapApi(() => notifications.markAsRead(id)),
};

export const adminApi = {
  databaseMeta: () => wrapApi(() => database.getDatabaseMeta()),
  table: (name: Parameters<typeof database.getTableData>[0]) => wrapApi(() => database.getTableData(name)),
};

export { apiCall, wrapApi };
