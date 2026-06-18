import type { UserActivity } from "@/models";
import { readUserTable, writeUserTable } from "@/utils/storage";
import { requireUserId } from "@/utils/user-context";

const EMPTY: UserActivity = {
  recentlyViewedProducts: [],
  recentlyViewedStores: [],
  recentlyCompared: [],
  searchHistory: [],
  recentOrders: [],
  favoriteCategories: [],
};

const MAX = 20;

function getActivity(userId: string): UserActivity {
  return readUserTable(userId, "activity", { ...EMPTY });
}

function save(userId: string, activity: UserActivity) {
  writeUserTable(userId, "activity", activity);
}

function pushUnique(list: string[], id: string, max = MAX): string[] {
  return [id, ...list.filter((x) => x !== id)].slice(0, max);
}

export function trackProductView(productId: string, categoryId?: string) {
  const userId = requireUserId();
  const a = getActivity(userId);
  a.recentlyViewedProducts = pushUnique(a.recentlyViewedProducts, productId);
  if (categoryId) a.favoriteCategories = pushUnique(a.favoriteCategories, categoryId, 10);
  save(userId, a);
}

export function trackStoreView(storeId: string) {
  const userId = requireUserId();
  const a = getActivity(userId);
  a.recentlyViewedStores = pushUnique(a.recentlyViewedStores, storeId);
  save(userId, a);
}

export function trackCompare(productIds: string[]) {
  const userId = requireUserId();
  const a = getActivity(userId);
  a.recentlyCompared = pushUnique(a.recentlyCompared, productIds.join(","), 10);
  save(userId, a);
}

export function trackSearch(query: string, filters?: Record<string, string>) {
  const userId = requireUserId();
  const a = getActivity(userId);
  a.searchHistory = [{ query, at: new Date().toISOString(), filters }, ...a.searchHistory].slice(0, MAX);
  save(userId, a);
}

export function trackOrder(orderId: string) {
  const userId = requireUserId();
  const a = getActivity(userId);
  a.recentOrders = pushUnique(a.recentOrders, orderId);
  save(userId, a);
}

export function getUserActivity(userId?: string): UserActivity {
  const id = userId ?? requireUserId();
  return getActivity(id);
}
