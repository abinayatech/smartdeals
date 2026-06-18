import { KEYS, readJSON, writeJSON } from "./storage";

export type PlannerPlan = {
  id: string;
  title: string;
  desc: string;
  savings: number;
  time: string;
  active: boolean;
  createdAt: string;
  products: string[];
};

export type PlannerHistoryEntry = {
  id: string;
  action: "activate" | "save" | "delete";
  planTitle: string;
  timestamp: string;
};

const DEFAULT_PLANS: PlannerPlan[] = [
  { id: "cheapest", title: "Cheapest Plan", desc: "Visit 3 stores · 12 km", savings: 2450, time: "~85 min", active: false, createdAt: new Date().toISOString(), products: [] },
  { id: "fastest", title: "Fastest Plan", desc: "1 store, instant delivery", savings: 980, time: "~20 min", active: false, createdAt: new Date().toISOString(), products: [] },
  { id: "hybrid", title: "Hybrid Plan", desc: "2 stores + 1 delivery", savings: 1820, time: "~45 min", active: false, createdAt: new Date().toISOString(), products: [] },
];

export function getPlans(): PlannerPlan[] {
  const saved = readJSON<PlannerPlan[]>(KEYS.planner, []);
  if (saved.length === 0) {
    writeJSON(KEYS.planner, DEFAULT_PLANS);
    return DEFAULT_PLANS;
  }
  return saved;
}

export function savePlans(plans: PlannerPlan[]) {
  writeJSON(KEYS.planner, plans);
}

export function activatePlan(planId: string) {
  const plans = getPlans().map((p) => ({ ...p, active: p.id === planId }));
  savePlans(plans);
  addHistory("activate", plans.find((p) => p.id === planId)?.title ?? planId);
  return plans;
}

export function savePlan(planId: string, products: string[]) {
  const plans = getPlans().map((p) =>
    p.id === planId ? { ...p, products, createdAt: new Date().toISOString() } : p,
  );
  savePlans(plans);
  addHistory("save", plans.find((p) => p.id === planId)?.title ?? planId);
  return plans;
}

export function deletePlan(planId: string) {
  const plan = getPlans().find((p) => p.id === planId);
  const plans = getPlans().filter((p) => p.id !== planId);
  savePlans(plans.length ? plans : DEFAULT_PLANS);
  if (plan) addHistory("delete", plan.title);
  return plans;
}

export function addProductToPlanner(productId: string) {
  const plans = getPlans();
  const hybrid = plans.find((p) => p.id === "hybrid");
  if (hybrid && !hybrid.products.includes(productId)) {
    hybrid.products.push(productId);
    savePlans(plans);
  }
}

export function getHistory(): PlannerHistoryEntry[] {
  return readJSON<PlannerHistoryEntry[]>(KEYS.plannerHistory, []);
}

function addHistory(action: PlannerHistoryEntry["action"], planTitle: string) {
  const history = getHistory();
  history.unshift({
    id: crypto.randomUUID(),
    action,
    planTitle,
    timestamp: new Date().toISOString(),
  });
  writeJSON(KEYS.plannerHistory, history.slice(0, 50));
}

export function predictPriceDrop(productName: string, currentPrice: number) {
  const drop = Math.round(5 + Math.random() * 15);
  const predicted = Math.round(currentPrice * (1 - drop / 100));
  const days = Math.round(3 + Math.random() * 11);
  return { drop, predicted, days, confidence: Math.round(75 + Math.random() * 20) };
}

export function getRecommendations(userId: string, count = 4) {
  const seed = userId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return { seed, count };
}

export function budgetPlan(monthlyBudget: number) {
  const grocery = Math.round(monthlyBudget * 0.35);
  const essentials = Math.round(monthlyBudget * 0.25);
  const discretionary = Math.round(monthlyBudget * 0.25);
  const savings = Math.round(monthlyBudget * 0.15);
  return { grocery, essentials, discretionary, savings };
}

export function savingsForecast(currentSavings: number) {
  const monthly = Math.round(currentSavings * 0.12);
  const quarterly = monthly * 3;
  const yearly = monthly * 12;
  return { monthly, quarterly, yearly };
}
