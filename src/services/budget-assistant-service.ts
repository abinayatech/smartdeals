import type { BudgetPlanResult } from "@/models";
import { getProductById, products, stores } from "@/lib/mock-data";

export function generateBudgetPlans(budget: number, shoppingList: string[]): BudgetPlanResult[] {
  const terms = shoppingList.map((s) => s.trim().toLowerCase()).filter(Boolean);
  let matched = products.filter((p) =>
    terms.length === 0 || terms.some((t) => p.name.toLowerCase().includes(t) || p.category.toLowerCase().includes(t)),
  );
  if (matched.length === 0) matched = products.slice(0, 20);

  const byPrice = [...matched].sort((a, b) => a.price - b.price);
  const byDistance = [...matched].sort((a, b) => a.distanceKm - b.distanceKm);

  function buildPlan(
    id: BudgetPlanResult["id"],
    title: string,
    list: typeof products,
    storeStrategy: "min" | "single" | "balanced",
  ): BudgetPlanResult {
    let picked = list.slice(0, Math.min(8, list.length));
    let total = 0;
    const selected: typeof products = [];
    for (const p of picked) {
      if (total + p.price <= budget) {
        selected.push(p);
        total += p.price;
      }
    }
    if (selected.length === 0 && list[0]) {
      selected.push(list[0]);
      total = list[0].price;
    }
    const storeIds = [...new Set(selected.map((p) => p.storeId))];
    const storeNames = storeIds.map((id) => stores.find((s) => s.id === id)?.name ?? id);
    let storeCount = storeIds.length;
    if (storeStrategy === "single") storeCount = 1;
    if (storeStrategy === "min") storeCount = Math.min(storeCount, 2);
    const mrpTotal = selected.reduce((s, p) => s + p.mrp, 0);
    const distanceKm = selected.reduce((s, p) => s + p.distanceKm, 0) / Math.max(1, selected.length);
    const timeEstimate = storeStrategy === "single" ? "~25 min" : storeStrategy === "min" ? "~55 min" : "~40 min";

    return {
      id,
      title,
      cost: total,
      savings: Math.max(0, mrpTotal - total),
      distanceKm: Math.round(distanceKm * 10) / 10,
      storeCount,
      timeEstimate,
      productIds: selected.map((p) => p.id),
      stores: storeNames,
    };
  }

  return [
    buildPlan("cheapest", "Cheapest Plan", byPrice, "min"),
    buildPlan("fastest", "Fastest Plan", byDistance, "single"),
    buildPlan("balanced", "Balanced Plan", matched.sort((a, b) => a.price + a.distanceKm - (b.price + b.distanceKm)), "balanced"),
  ];
}

export function matchProductsFromList(items: string[]) {
  return items
    .map((name) => products.find((p) => p.name.toLowerCase().includes(name.toLowerCase())))
    .filter(Boolean);
}

export function getProductNames(ids: string[]) {
  return ids.map((id) => getProductById(id)?.name ?? id);
}
