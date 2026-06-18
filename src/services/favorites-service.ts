import { LEGACY_KEYS, migrateLegacyToUser, writeUserTable } from "@/utils/storage";
import { getCurrentUserId, requireUserId } from "@/utils/user-context";

function favoritesForUser(userId: string): string[] {
  return migrateLegacyToUser(userId, "favorites", LEGACY_KEYS.favorites, []);
}

export function getFavorites(userId?: string): string[] {
  const id = userId ?? getCurrentUserId();
  if (!id) return [];
  return favoritesForUser(id);
}

export function isFavorite(productId: string, userId?: string): boolean {
  return getFavorites(userId).includes(productId);
}

export function toggleFavorite(productId: string, userId?: string): boolean {
  const id = userId ?? requireUserId();
  const favs = favoritesForUser(id);
  const idx = favs.indexOf(productId);
  if (idx >= 0) {
    favs.splice(idx, 1);
    writeUserTable(id, "favorites", favs);
    return false;
  }
  favs.push(productId);
  writeUserTable(id, "favorites", favs);
  return true;
}

export function removeFavorite(productId: string, userId?: string) {
  const id = userId ?? requireUserId();
  writeUserTable(id, "favorites", favoritesForUser(id).filter((f) => f !== productId));
}
