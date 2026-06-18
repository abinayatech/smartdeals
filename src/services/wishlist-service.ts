import type { WishlistCollection } from "@/models";
import { readUserTable, writeUserTable } from "@/utils/storage";
import { requireUserId } from "@/utils/user-context";

const DEFAULT_COLLECTIONS: Omit<WishlistCollection, "id" | "createdAt" | "updatedAt">[] = [
  { name: "Tech Wishlist", productIds: [] },
  { name: "Fitness Wishlist", productIds: [] },
  { name: "Home Wishlist", productIds: [] },
  { name: "Grocery Wishlist", productIds: [] },
];

function ensureCollections(userId: string): WishlistCollection[] {
  let lists = readUserTable<WishlistCollection[] | null>(userId, "wishlists", null);
  if (!lists) {
    const now = new Date().toISOString();
    lists = DEFAULT_COLLECTIONS.map((c, i) => ({
      ...c,
      id: `wl-${i + 1}`,
      createdAt: now,
      updatedAt: now,
    }));
    writeUserTable(userId, "wishlists", lists);
  }
  return lists;
}

export function getWishlists(userId?: string): WishlistCollection[] {
  const id = userId ?? requireUserId();
  return ensureCollections(id);
}

export function createWishlist(name: string) {
  const userId = requireUserId();
  const lists = ensureCollections(userId);
  const now = new Date().toISOString();
  const list: WishlistCollection = { id: crypto.randomUUID(), name, productIds: [], createdAt: now, updatedAt: now };
  lists.push(list);
  writeUserTable(userId, "wishlists", lists);
  return list;
}

export function renameWishlist(id: string, name: string) {
  const userId = requireUserId();
  const lists = ensureCollections(userId).map((l) =>
    l.id === id ? { ...l, name, updatedAt: new Date().toISOString() } : l,
  );
  writeUserTable(userId, "wishlists", lists);
}

export function deleteWishlist(id: string) {
  const userId = requireUserId();
  writeUserTable(userId, "wishlists", ensureCollections(userId).filter((l) => l.id !== id));
}

export function addToWishlist(collectionId: string, productId: string) {
  const userId = requireUserId();
  const lists = ensureCollections(userId).map((l) => {
    if (l.id !== collectionId) return l;
    if (l.productIds.includes(productId)) return l;
    return { ...l, productIds: [...l.productIds, productId], updatedAt: new Date().toISOString() };
  });
  writeUserTable(userId, "wishlists", lists);
}

export function moveProduct(fromId: string, toId: string, productId: string) {
  const userId = requireUserId();
  const now = new Date().toISOString();
  const lists = ensureCollections(userId).map((l) => {
    if (l.id === fromId) return { ...l, productIds: l.productIds.filter((p) => p !== productId), updatedAt: now };
    if (l.id === toId && !l.productIds.includes(productId)) return { ...l, productIds: [...l.productIds, productId], updatedAt: now };
    return l;
  });
  writeUserTable(userId, "wishlists", lists);
}

export function removeFromWishlist(collectionId: string, productId: string) {
  const userId = requireUserId();
  const lists = ensureCollections(userId).map((l) =>
    l.id === collectionId ? { ...l, productIds: l.productIds.filter((p) => p !== productId), updatedAt: new Date().toISOString() } : l,
  );
  writeUserTable(userId, "wishlists", lists);
}
