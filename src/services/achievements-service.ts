import type { Achievement, AchievementId } from "@/models";
import { readUserTable, writeUserTable } from "@/utils/storage";
import { getUserActivity } from "./activity-service";
import { getFavorites } from "./favorites-service";
import { getUserOrderStats } from "./orders-service";
import { getSavedSearches } from "./saved-search-service";
import { requireUserId } from "@/utils/user-context";

const DEFINITIONS: Record<AchievementId, Omit<Achievement, "progress" | "unlockedAt">> = {
  "deal-hunter": { id: "deal-hunter", title: "Deal Hunter", description: "View 25 products", icon: "🎯", target: 25 },
  "budget-master": { id: "budget-master", title: "Budget Master", description: "Save ₹10,000 total", icon: "💰", target: 10000 },
  "savings-champion": { id: "savings-champion", title: "Savings Champion", description: "Complete 10 orders", icon: "🏆", target: 10 },
  "smart-shopper": { id: "smart-shopper", title: "Smart Shopper", description: "Save 5 favorite products", icon: "🛍️", target: 5 },
  "loyalty-expert": { id: "loyalty-expert", title: "Loyalty Expert", description: "Visit 10 stores", icon: "⭐", target: 10 },
  "planner-expert": { id: "planner-expert", title: "Planner Expert", description: "Save 3 searches", icon: "🧠", target: 3 },
};

export function getAchievements(userId?: string): Achievement[] {
  const id = userId ?? requireUserId();
  const activity = getUserActivity(id);
  const favs = getFavorites(id);
  const orders = getUserOrderStats(id);
  const searches = getSavedSearches(id);
  const stored = readUserTable<Partial<Record<AchievementId, string>>>(id, "achievements", {});

  const progressMap: Record<AchievementId, number> = {
    "deal-hunter": activity.recentlyViewedProducts.length,
    "budget-master": orders.totalSaved,
    "savings-champion": orders.count,
    "smart-shopper": favs.length,
    "loyalty-expert": activity.recentlyViewedStores.length,
    "planner-expert": searches.length,
  };

  let dirty = false;
  const result = (Object.keys(DEFINITIONS) as AchievementId[]).map((key) => {
    const def = DEFINITIONS[key];
    const progress = Math.min(progressMap[key], def.target);
    let unlockedAt = stored[key];
    if (!unlockedAt && progress >= def.target) {
      unlockedAt = new Date().toISOString();
      stored[key] = unlockedAt;
      dirty = true;
    }
    return { ...def, progress, unlockedAt };
  });
  if (dirty) writeUserTable(id, "achievements", stored);
  return result;
}
