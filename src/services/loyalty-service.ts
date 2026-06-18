import type { LoyaltyProfile } from "@/models";
import { readUserTable, writeUserTable } from "@/utils/storage";
import { getUserOrderStats } from "./orders-service";
import { requireUserId } from "@/utils/user-context";

const DEFAULT_REWARDS = [
  { id: "r1", title: "₹100 off next order", pointsCost: 500, redeemed: false },
  { id: "r2", title: "Free delivery (3 orders)", pointsCost: 800, redeemed: false },
  { id: "r3", title: "15% flash sale access", pointsCost: 1200, redeemed: false },
  { id: "r4", title: "₹500 premium voucher", pointsCost: 2500, redeemed: false },
];

const MILESTONES = [
  { id: "m1", title: "First ₹5,000 spent", target: 5000 },
  { id: "m2", title: "₹25,000 lifetime spend", target: 25000 },
  { id: "m3", title: "₹50,000 savings champion", target: 50000 },
  { id: "m4", title: "₹1,00,000 loyalty legend", target: 100000 },
];

function tierFromPoints(points: number): LoyaltyProfile["tier"] {
  if (points >= 5000) return "Platinum";
  if (points >= 2500) return "Gold";
  if (points >= 1000) return "Silver";
  return "Bronze";
}

function ensureProfile(userId: string): LoyaltyProfile {
  let profile = readUserTable<LoyaltyProfile | null>(userId, "loyalty", null);
  if (!profile) {
    profile = {
      points: 0,
      tier: "Bronze",
      badges: [],
      milestones: MILESTONES.map((m) => ({ ...m, progress: 0 })),
      rewards: DEFAULT_REWARDS.map((r) => ({ ...r })),
    };
    writeUserTable(userId, "loyalty", profile);
  }
  return profile;
}

export function getLoyaltyProfile(userId?: string): LoyaltyProfile {
  const id = userId ?? requireUserId();
  const stats = getUserOrderStats(id);
  const profile = ensureProfile(id);
  profile.points = Math.floor(stats.totalSpent / 10) + stats.count * 50;
  profile.tier = tierFromPoints(profile.points);
  profile.milestones = profile.milestones.map((m) => {
    const progress = m.id === "m1" ? stats.totalSpent : stats.totalSpent;
    const unlockedAt = progress >= m.target ? profile.milestones.find((x) => x.id === m.id)?.unlockedAt ?? new Date().toISOString() : undefined;
    return { ...m, progress: Math.min(progress, m.target), unlockedAt };
  });
  if (stats.count >= 5 && !profile.badges.includes("Regular Shopper")) profile.badges.push("Regular Shopper");
  if (stats.totalSaved >= 5000 && !profile.badges.includes("Savings Star")) profile.badges.push("Savings Star");
  if (profile.points >= 2500 && !profile.badges.includes("Gold Member")) profile.badges.push("Gold Member");
  writeUserTable(id, "loyalty", profile);
  return profile;
}

export function redeemReward(rewardId: string) {
  const userId = requireUserId();
  const profile = getLoyaltyProfile(userId);
  const reward = profile.rewards.find((r) => r.id === rewardId);
  if (!reward || reward.redeemed) throw new Error("Reward unavailable");
  if (profile.points < reward.pointsCost) throw new Error("Not enough points");
  profile.points -= reward.pointsCost;
  reward.redeemed = true;
  writeUserTable(userId, "loyalty", profile);
  return profile;
}

export function addLoyaltyPoints(userId: string, points: number) {
  const profile = getLoyaltyProfile(userId);
  profile.points += points;
  profile.tier = tierFromPoints(profile.points);
  writeUserTable(userId, "loyalty", profile);
}
