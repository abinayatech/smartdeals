import type { DealerAnalytics } from "@/models";
import { deals, getProductsByStore, getStoreById, products, seedOrders } from "@/lib/mock-data";
import { getStoreInventory } from "./inventory-service";
import { getStoreReturns } from "./returns-service";
import { GLOBAL_KEYS, LEGACY_KEYS, readJSON, writeJSON } from "@/utils/storage";
import { loadSession } from "./auth-service";

export function getDealerStoreId(): string {
  const session = loadSession();
  if (!session?.storeId) throw new Error("No store assigned to dealer");
  return session.storeId;
}

export function getDealerStore() {
  const storeId = getDealerStoreId();
  return getStoreById(storeId);
}

export function getDealerProducts() {
  return getProductsByStore(getDealerStoreId());
}

export function getDealerDeals() {
  return deals.filter((d) => d.storeId === getDealerStoreId());
}

export function getDealerOrders() {
  const storeId = getDealerStoreId();
  const userOrders = readJSON<typeof seedOrders>(LEGACY_KEYS.orders, []);
  return [...seedOrders, ...userOrders].filter((o) => o.storeId === storeId);
}

export function getDealerAnalytics(): DealerAnalytics {
  const storeId = getDealerStoreId();
  const store = getStoreById(storeId);
  const orders = getDealerOrders();
  const storeProducts = getProductsByStore(storeId);
  const delivered = orders.filter((o) => o.status === "Delivered");
  const revenue = delivered.reduce((s, o) => s + o.total, 0);
  const productsSold = delivered.reduce((s, o) => s + o.items.reduce((a, i) => a + i.qty, 0), 0);

  const productCounts: Record<string, number> = {};
  for (const o of delivered) {
    for (const item of o.items) {
      productCounts[item.name] = (productCounts[item.name] ?? 0) + item.qty;
    }
  }
  const bestProduct = Object.entries(productCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? storeProducts[0]?.name ?? "—";

  return {
    revenue,
    orders: orders.length,
    productsSold,
    bestProduct,
    storePerformance: {
      storeName: store?.name ?? "Store",
      revenue,
      orders: orders.length,
      rating: store?.rating ?? 4.5,
    },
  };
}

export function updateDealerProductPrice(productId: string, price: number) {
  type Overrides = { products?: Record<string, { price?: number }> };
  const overrides = readJSON<Overrides>(GLOBAL_KEYS.adminData, {});
  if (!overrides.products) overrides.products = {};
  overrides.products[productId] = { ...overrides.products[productId], price };
  writeJSON(GLOBAL_KEYS.adminData, overrides);
}

export function getDealerInventorySummary() {
  const inv = getStoreInventory(getDealerStoreId());
  return {
    totalAvailable: inv.reduce((s, i) => s + i.stockAvailable, 0),
    totalSold: inv.reduce((s, i) => s + i.stockSold, 0),
    totalReserved: inv.reduce((s, i) => s + i.reservedStock, 0),
    totalReturned: inv.reduce((s, i) => s + i.returnedStock, 0),
    items: inv,
  };
}

export function getDealerPendingReturns() {
  return getStoreReturns(getDealerStoreId()).filter((r) => r.status === "Requested");
}

export function updateStoreInfo(updates: { dealCount?: number; delivery?: boolean; pickup?: boolean }) {
  type Overrides = { stores?: Record<string, Partial<{ dealCount: number; delivery: boolean; pickup: boolean }>> };
  const overrides = readJSON<Overrides>(GLOBAL_KEYS.adminData, {});
  const storeId = getDealerStoreId();
  if (!overrides.stores) overrides.stores = {};
  overrides.stores[storeId] = { ...overrides.stores[storeId], ...updates };
  writeJSON(GLOBAL_KEYS.adminData, overrides);
}

export { products, deals };
