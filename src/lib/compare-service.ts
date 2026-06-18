import { LEGACY_KEYS, migrateLegacyToUser, writeUserTable } from "@/utils/storage";
import { getCurrentUserId } from "@/utils/user-context";

const MAX_COMPARE = 3;

function compareForUser(userId: string | null): string[] {
  if (!userId) return [];
  return migrateLegacyToUser(userId, "compare", LEGACY_KEYS.compare, []);
}

export function getCompareList(): string[] {
  return compareForUser(getCurrentUserId());
}

export function toggleCompare(productId: string): { added: boolean; list: string[] } {
  const userId = getCurrentUserId();
  if (!userId) return { added: false, list: [] };
  const list = compareForUser(userId);
  const idx = list.indexOf(productId);
  if (idx >= 0) {
    list.splice(idx, 1);
    writeUserTable(userId, "compare", list);
    return { added: false, list };
  }
  if (list.length >= MAX_COMPARE) list.shift();
  list.push(productId);
  writeUserTable(userId, "compare", list);
  return { added: true, list };
}

export function removeFromCompare(productId: string) {
  const userId = getCurrentUserId();
  if (!userId) return [];
  const list = compareForUser(userId).filter((id) => id !== productId);
  writeUserTable(userId, "compare", list);
  return list;
}

export function clearCompare() {
  const userId = getCurrentUserId();
  if (!userId) return;
  writeUserTable(userId, "compare", []);
}
