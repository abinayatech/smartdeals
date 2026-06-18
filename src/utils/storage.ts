export const DB_PREFIX = "smartdeal.db";

export const GLOBAL_KEYS = {
  user: "smartdeal.user",
  remember: "smartdeal.remember",
  accounts: "smartdeal.accounts",
  sessionToken: "smartdeal.sessionToken",
  refreshToken: "smartdeal.refreshToken",
  adminData: "smartdeal.adminOverrides",
  catalogSeed: "smartdeal.catalogSeeded",
  productReviews: "smartdeal.productReviews",
  productQA: "smartdeal.productQA",
  inventory: "smartdeal.inventory",
  returns: "smartdeal.returns",
} as const;

/** Legacy global keys — migrated to per-user on login */
export const LEGACY_KEYS = {
  cart: "smartdeal.cart",
  favorites: "smartdeal.favorites",
  orders: "smartdeal.orders",
  notifications: "smartdeal.notifications",
  planner: "smartdeal.planner",
  plannerHistory: "smartdeal.plannerHistory",
  settings: "smartdeal.settings",
  addresses: "smartdeal.addresses",
  checkout: "smartdeal.checkout",
  lastReceipt: "smartdeal.lastReceipt",
  plan: "smartdeal.subscription",
  compare: "smartdeal.compare",
} as const;

export type UserTable =
  | "cart"
  | "favorites"
  | "orders"
  | "notifications"
  | "planner"
  | "plannerHistory"
  | "settings"
  | "addresses"
  | "checkout"
  | "lastReceipt"
  | "plan"
  | "compare"
  | "activity"
  | "wishlists"
  | "savedSearches"
  | "achievements"
  | "loyalty"
  | "userReturns";

export function userTableKey(userId: string, table: UserTable): string {
  return `${DB_PREFIX}.${userId}.${table}`;
}

export function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeKey(key: string) {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key);
}

export function listUserIds(): string[] {
  if (typeof window === "undefined") return [];
  const ids = new Set<string>();
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key?.startsWith(`${DB_PREFIX}.`)) continue;
    const parts = key.split(".");
    if (parts.length >= 3) ids.add(parts[2]);
  }
  return [...ids];
}

export function readUserTable<T>(userId: string, table: UserTable, fallback: T): T {
  return readJSON(userTableKey(userId, table), fallback);
}

export function writeUserTable<T>(userId: string, table: UserTable, value: T) {
  writeJSON(userTableKey(userId, table), value);
}

/** Migrate legacy global key to user-scoped table once */
export function migrateLegacyToUser<T>(userId: string, table: UserTable, legacyKey: string, fallback: T): T {
  const userKey = userTableKey(userId, table);
  const existing = readJSON<T | null>(userKey, null);
  if (existing !== null && (Array.isArray(existing) ? existing.length > 0 : true)) {
    return existing as T;
  }
  const legacy = readJSON<T>(legacyKey, fallback);
  if (typeof window !== "undefined" && legacy !== fallback) {
    writeJSON(userKey, legacy);
    localStorage.removeItem(legacyKey);
  }
  return readJSON(userKey, fallback);
}
