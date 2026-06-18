import type { SavedSearch } from "@/models";
import { readUserTable, writeUserTable } from "@/utils/storage";
import { requireUserId } from "@/utils/user-context";

export function getSavedSearches(userId?: string): SavedSearch[] {
  const id = userId ?? requireUserId();
  return readUserTable(id, "savedSearches", []);
}

export function saveSearch(name: string, query: string, filters: Record<string, string> = {}) {
  const userId = requireUserId();
  const list = getSavedSearches(userId);
  const entry: SavedSearch = { id: crypto.randomUUID(), name, query, filters, createdAt: new Date().toISOString() };
  list.unshift(entry);
  writeUserTable(userId, "savedSearches", list);
  return entry;
}

export function updateSavedSearch(id: string, updates: Partial<Pick<SavedSearch, "name" | "query" | "filters">>) {
  const userId = requireUserId();
  const list = getSavedSearches(userId).map((s) => (s.id === id ? { ...s, ...updates } : s));
  writeUserTable(userId, "savedSearches", list);
}

export function deleteSavedSearch(id: string) {
  const userId = requireUserId();
  writeUserTable(userId, "savedSearches", getSavedSearches(userId).filter((s) => s.id !== id));
}
