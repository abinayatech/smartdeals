
import { getProductById, products } from "@/lib/mock-data";
import type { Product } from "@/models";
import { getUserActivity } from "./activity-service";
import { getCart } from "./cart-service";
import { getFavorites } from "./favorites-service";
import { getOrders } from "./orders-service";
import { requireUserId } from "@/utils/user-context";

function scoreProduct(p: Product, signals: { viewed: Set<string>; favs: Set<string>; cart: Set<string>; ordered: Set<string>; categories: Set<string>; searches: string[] }): number {
  let score = p.dealScore;
  if (signals.viewed.has(p.id)) score += 3;
  if (signals.favs.has(p.id)) score += 5;
  if (signals.cart.has(p.id)) score += 4;
  if (signals.ordered.has(p.id)) score += 2;
  if (signals.categories.has(p.categoryId)) score += 2;
  for (const q of signals.searches) {
    if (p.name.toLowerCase().includes(q.toLowerCase()) || p.category.toLowerCase().includes(q.toLowerCase())) score += 3;
  }
  return score;
}

export function getPersonalizedRecommendations(userId?: string, limit = 8): Product[] {
  const id = userId ?? requireUserId();
  const activity = getUserActivity(id);
  const favs = new Set(getFavorites(id));
  const cart = new Set(getCart(id).map((i) => i.id));
  const orders = getOrders(id);
  const ordered = new Set(orders.flatMap((o) => o.items.map((i) => i.productId)));
  const categories = new Set(activity.favoriteCategories);
  const searches = activity.searchHistory.map((s) => s.query);
  const exclude = new Set([...activity.recentlyViewedProducts, ...favs, ...cart]);

  return [...products]
    .filter((p) => !exclude.has(p.id))
    .map((p) => ({ p, score: scoreProduct(p, { viewed: new Set(activity.recentlyViewedProducts), favs, cart, ordered, categories, searches }) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ p }) => p);
}

export function getSimilarProducts(productId: string, limit = 4): Product[] {
  const source = getProductById(productId);
  if (!source) return [];
  return products.filter((p) => p.categoryId === source.categoryId && p.id !== productId).sort((a, b) => b.dealScore - a.dealScore).slice(0, limit);
}
