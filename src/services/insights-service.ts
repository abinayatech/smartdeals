import type { ShoppingInsights } from "@/models";
import { getProductById, seedOrders } from "@/lib/mock-data";
import { getUserActivity } from "./activity-service";
import { getOrders, getUserOrderStats } from "./orders-service";
import { requireUserId } from "@/utils/user-context";

export function getShoppingInsights(userId?: string): ShoppingInsights {
  const id = userId ?? requireUserId();
  const stats = getUserOrderStats(id);
  const orders = getOrders(id);
  const activity = getUserActivity(id);
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const monthOrders = orders.filter((o) => new Date(o.placedAt) >= monthStart);
  const monthlySpending = monthOrders.reduce((s, o) => s + o.total, 0);
  const monthlySavings = monthOrders.reduce((s, o) => s + o.discount, 0);

  const storeCounts: Record<string, number> = {};
  const catCounts: Record<string, number> = {};
  for (const o of orders) {
    storeCounts[o.store] = (storeCounts[o.store] ?? 0) + 1;
    for (const item of o.items) {
      const p = getProductById(item.productId);
      if (p) catCounts[p.category] = (catCounts[p.category] ?? 0) + item.qty;
    }
  }

  const favoriteStore = Object.entries(storeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
  const favoriteCategory = activity.favoriteCategories[0]
    ? getProductById(activity.recentlyViewedProducts[0] ?? "")?.category ?? activity.favoriteCategories[0]
    : Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
  const mostPurchasedCategory = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

  const delivered = orders.filter((o) => o.status === "Delivered").length;
  const dealSuccessRate = orders.length ? Math.round((delivered / orders.length) * 100) : 0;
  const purchaseFrequency = orders.length ? Math.round(orders.length / Math.max(1, Math.ceil((Date.now() - new Date(orders[orders.length - 1]?.placedAt ?? Date.now()).getTime()) / (30 * 86400000)))) : 0;

  return {
    monthlySpending,
    monthlySavings,
    favoriteStore,
    favoriteCategory,
    mostPurchasedCategory,
    purchaseFrequency,
    totalOrders: stats.count,
    totalSavings: stats.totalSaved,
    dealSuccessRate,
  };
}

export function getGlobalSeedInsights() {
  return { totalSeedOrders: seedOrders.length };
}
