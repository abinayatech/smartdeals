export * from "@/utils/storage";
import { GLOBAL_KEYS, LEGACY_KEYS } from "@/utils/storage";

/** Backward-compatible key map used by legacy services */
export const KEYS = {
  user: GLOBAL_KEYS.user,
  remember: GLOBAL_KEYS.remember,
  accounts: GLOBAL_KEYS.accounts,
  adminData: GLOBAL_KEYS.adminData,
  cart: LEGACY_KEYS.cart,
  favorites: LEGACY_KEYS.favorites,
  orders: LEGACY_KEYS.orders,
  notifications: LEGACY_KEYS.notifications,
  planner: LEGACY_KEYS.planner,
  plannerHistory: LEGACY_KEYS.plannerHistory,
  settings: LEGACY_KEYS.settings,
  addresses: LEGACY_KEYS.addresses,
  checkout: LEGACY_KEYS.checkout,
  lastReceipt: LEGACY_KEYS.lastReceipt,
  plan: LEGACY_KEYS.plan,
  compare: LEGACY_KEYS.compare,
} as const;
