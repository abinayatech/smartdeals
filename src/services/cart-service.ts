import type { Product } from "@/models";
import { LEGACY_KEYS, migrateLegacyToUser, readUserTable, writeUserTable } from "@/utils/storage";
import { getCurrentUserId, requireUserId } from "@/utils/user-context";

export type CartItem = Product & { qty: number };

function cartForUser(userId: string): CartItem[] {
  return migrateLegacyToUser(userId, "cart", LEGACY_KEYS.cart, []);
}

function save(userId: string, items: CartItem[]) {
  writeUserTable(userId, "cart", items);
}

export function getCart(userId?: string): CartItem[] {
  const id = userId ?? getCurrentUserId();
  if (!id) return [];
  return cartForUser(id);
}

export function addToCart(product: Product, qty = 1, userId?: string) {
  const id = userId ?? requireUserId();
  const cart = cartForUser(id);
  const existing = cart.find((i) => i.id === product.id);
  if (existing) existing.qty += qty;
  else cart.push({ ...product, qty });
  save(id, cart);
  return cart;
}

export function removeFromCart(productId: string, userId?: string) {
  const id = userId ?? requireUserId();
  const cart = cartForUser(id).filter((i) => i.id !== productId);
  save(id, cart);
  return cart;
}

export function updateCartQty(productId: string, qty: number, userId?: string) {
  const id = userId ?? requireUserId();
  const cart = cartForUser(id).map((i) => (i.id === productId ? { ...i, qty: Math.max(1, qty) } : i));
  save(id, cart);
  return cart;
}

export function clearCart(userId?: string) {
  const id = userId ?? requireUserId();
  save(id, []);
}

export function cartCount(userId?: string): number {
  return getCart(userId).reduce((s, i) => s + i.qty, 0);
}
