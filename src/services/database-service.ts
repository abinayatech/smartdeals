import {
  categories,
  deals,
  mockUsers,
  products,
  reviews,
  seedNotifications,
  seedOrders,
  stores,
} from "@/lib/mock-data";
import { getAccounts } from "@/services/auth-service";
import { DB_PREFIX, GLOBAL_KEYS, listUserIds, readJSON, readUserTable, type UserTable } from "@/utils/storage";

export type DbTableName =
  | "users"
  | "products"
  | "stores"
  | "categories"
  | "reviews"
  | "orders"
  | "notifications"
  | "plannerHistory"
  | "wishlists"
  | "savedSearches"
  | "achievements";

export const DB_TABLES: { id: DbTableName; label: string; description: string }[] = [
  { id: "users", label: "Users", description: "Registered accounts + seed users" },
  { id: "products", label: "Products", description: "Catalog products" },
  { id: "stores", label: "Stores", description: "Retail stores" },
  { id: "categories", label: "Categories", description: "Product categories" },
  { id: "reviews", label: "Reviews", description: "Product reviews" },
  { id: "orders", label: "Orders", description: "Seed + user orders" },
  { id: "notifications", label: "Notifications", description: "Seed notifications" },
  { id: "plannerHistory", label: "Planner History", description: "Per-user AI planner logs" },
  { id: "wishlists", label: "Wishlists", description: "Per-user wishlist collections" },
  { id: "savedSearches", label: "Saved Searches", description: "Per-user saved searches" },
  { id: "achievements", label: "Achievements", description: "Per-user achievement unlocks" },
];

const USER_TABLE_MAP: Record<string, UserTable> = {
  plannerHistory: "plannerHistory",
  wishlists: "wishlists",
  savedSearches: "savedSearches",
  achievements: "achievements",
};

export function getTableData(table: DbTableName): unknown[] {
  switch (table) {
    case "users":
      return [...getAccounts(), ...mockUsers];
    case "products":
      return products;
    case "stores":
      return stores;
    case "categories":
      return categories;
    case "reviews":
      return reviews;
    case "orders":
      return [...seedOrders, ...collectUserTableRows("orders")];
    case "notifications":
      return [...seedNotifications, ...collectUserTableRows("notifications")];
    case "plannerHistory":
    case "wishlists":
    case "savedSearches":
    case "achievements":
      return collectUserTableRows(USER_TABLE_MAP[table]);
    default:
      return [];
  }
}

function collectUserTableRows(table: UserTable): unknown[] {
  const rows: unknown[] = [];
  for (const userId of listUserIds()) {
    const data = readUserTable(userId, table, null);
    if (!data) continue;
    if (Array.isArray(data)) rows.push(...data.map((r) => ({ userId, ...((typeof r === "object" && r) || {}) })));
    else rows.push({ userId, ...(data as object) });
  }
  return rows;
}

export function getTableCount(table: DbTableName): number {
  return getTableData(table).length;
}

export function exportTableJson(table: DbTableName): string {
  return JSON.stringify(getTableData(table), null, 2);
}

export function getDatabaseMeta() {
  return {
    prefix: DB_PREFIX,
    globalKeys: GLOBAL_KEYS,
    userIds: listUserIds(),
    tables: DB_TABLES.map((t) => ({ ...t, count: getTableCount(t.id) })),
  };
}

export function refreshDatabaseView() {
  return getDatabaseMeta();
}

export function readRawStorageSnapshot(): Record<string, unknown> {
  if (typeof window === "undefined") return {};
  const out: Record<string, unknown> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key?.startsWith("smartdeal.")) continue;
    out[key] = readJSON(key, null);
  }
  return out;
}
