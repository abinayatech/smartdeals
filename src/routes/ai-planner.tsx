import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, History, Sparkles, Trash2, TrendingDown } from "lucide-react";
import { useEffect, useState } from "react";
import { FloatingNav } from "@/components/layout/FloatingNav";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";
import { useAuth } from "@/lib/auth-context";
import {
  activatePlan,
  budgetPlan,
  deletePlan,
  getHistory,
  getPlans,
  predictPriceDrop,
  savePlan,
  savingsForecast,
  type PlannerPlan,
} from "@/lib/planner-service";
import { generateBudgetPlans } from "@/services/budget-assistant-service";
import type { BudgetPlanResult } from "@/models";
import { formatINR, products } from "@/lib/mock-data";
import { requireAuth } from "@/lib/route-guard";

export const Route = createFileRoute("/ai-planner")({
  head: () => ({ meta: [{ title: "AI Planner · Smart Deal" }] }),
  beforeLoad: () => requireAuth("/ai-planner"),
  component: PlannerPage,
});

function PlannerPage() {
  const { user } = useAuth();
  const [plans, setPlans] = useState<PlannerPlan[]>([]);
  const [history, setHistory] = useState(getHistory());
  const [message, setMessage] = useState<string | null>(null);
  const [budgetAmount, setBudgetAmount] = useState(5000);
  const [shoppingList, setShoppingList] = useState("rice, milk, headphones");
  const [budgetPlans, setBudgetPlans] = useState<BudgetPlanResult[]>(() => generateBudgetPlans(5000, ["rice", "milk", "headphones"]));
  const budget = budgetPlan(25000);
  const forecast = savingsForecast(18420);
  const recommendations = products.filter((_, i) => i % 47 === 0).slice(0, 4);

  useEffect(() => {
    setPlans(getPlans());
    setHistory(getHistory());
  }, []);

  const refresh = () => {
    setPlans(getPlans());
    setHistory(getHistory());
  };

  return (
    <div className="min-h-screen bg-background">
      <FloatingNav />
      <PageHeader eyebrow="Intelligence" title="Your AI Shopping Planner" subtitle="Predict the best date, store and combo to maximize savings." breadcrumbs={[{ label: "AI Planner" }]} />
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto space-y-10">
          {message && <div className="p-4 bg-savings/10 text-savings rounded-xl text-sm ring-1 ring-savings/20">{message}</div>}

          <div className="bg-card ring-1 ring-border rounded-2xl p-6 shadow-card">
            <h2 className="text-lg font-medium mb-4">Budget Shopping Assistant</h2>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Budget (₹)</label>
                <input type="number" value={budgetAmount} onChange={(e) => setBudgetAmount(Number(e.target.value))} className="mt-1 w-full bg-muted/50 rounded-xl px-4 py-2.5 text-sm ring-1 ring-border" />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-medium text-muted-foreground">Shopping list (comma-separated)</label>
                <input value={shoppingList} onChange={(e) => setShoppingList(e.target.value)} className="mt-1 w-full bg-muted/50 rounded-xl px-4 py-2.5 text-sm ring-1 ring-border" />
              </div>
            </div>
            <button onClick={() => setBudgetPlans(generateBudgetPlans(budgetAmount, shoppingList.split(",")))} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">Generate plans</button>
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              {budgetPlans.map((p) => (
                <div key={p.id} className="ring-1 ring-border rounded-xl p-4 bg-muted/30">
                  <div className="font-medium">{p.title}</div>
                  <div className="text-2xl font-semibold text-savings mt-2">{formatINR(p.cost)}</div>
                  <dl className="mt-3 space-y-1 text-xs text-muted-foreground">
                    <div className="flex justify-between"><dt>Savings</dt><dd className="text-savings font-medium">{formatINR(p.savings)}</dd></div>
                    <div className="flex justify-between"><dt>Distance</dt><dd>{p.distanceKm} km</dd></div>
                    <div className="flex justify-between"><dt>Stores</dt><dd>{p.storeCount}</dd></div>
                    <div className="flex justify-between"><dt>Time</dt><dd>{p.timeEstimate}</dd></div>
                  </dl>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {plans.map((p) => (
              <div key={p.id} className={`bg-card ring-1 rounded-2xl p-6 transition-all ${p.active ? "ring-accent" : "ring-border hover:ring-accent/40"}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-accent uppercase tracking-wider">
                    <Sparkles className="size-3.5" /> {p.title}
                  </div>
                  {p.active && <span className="text-[10px] bg-accent text-accent-foreground px-2 py-0.5 rounded font-bold">ACTIVE</span>}
                </div>
                <div className="mt-4 text-2xl font-semibold text-savings">{formatINR(p.savings)}</div>
                <div className="text-xs text-muted-foreground">potential savings · {p.time}</div>
                <p className="text-sm text-secondary mt-4">{p.desc}</p>
                <div className="mt-5 flex gap-2">
                  <button onClick={() => { activatePlan(p.id); refresh(); setMessage(`${p.title} activated!`); }} className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">Activate</button>
                  <button onClick={() => { savePlan(p.id, recommendations.map((r) => r.id)); refresh(); setMessage(`${p.title} saved with ${recommendations.length} products.`); }} className="py-2 px-3 ring-1 ring-border rounded-lg text-sm">Save</button>
                  <button onClick={() => { deletePlan(p.id); refresh(); setMessage(`${p.title} removed.`); }} aria-label="Delete" className="py-2 px-3 ring-1 ring-border rounded-lg text-sm text-destructive"><Trash2 className="size-4" /></button>
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="bg-card ring-1 ring-border rounded-2xl p-6">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-secondary">
                <Calendar className="size-4" /> Price Predictions
              </div>
              <div className="mt-5 space-y-3">
                {recommendations.map((p) => {
                  const pred = predictPriceDrop(p.name, p.price);
                  return (
                    <div key={p.id} className="flex items-center gap-4 p-3 bg-muted rounded-xl">
                      <img src={p.image} alt={p.name} loading="lazy" className="size-12 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{p.name}</div>
                        <div className="text-xs text-muted-foreground">Drop ~{pred.drop}% in {pred.days} days → {formatINR(pred.predicted)}</div>
                      </div>
                      <TrendingDown className="size-4 text-savings shrink-0" />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-card ring-1 ring-border rounded-2xl p-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-secondary">Budget Planning</div>
              <div className="mt-4 space-y-3 text-sm">
                <BudgetRow label="Grocery" amount={budget.grocery} pct={35} />
                <BudgetRow label="Essentials" amount={budget.essentials} pct={25} />
                <BudgetRow label="Discretionary" amount={budget.discretionary} pct={25} />
                <BudgetRow label="Savings Target" amount={budget.savings} pct={15} accent />
              </div>
            </div>

            <div className="bg-primary text-primary-foreground rounded-2xl p-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-accent">Savings Forecast</div>
              <div className="mt-4 space-y-4">
                <div><div className="text-2xl font-semibold">{formatINR(forecast.monthly)}</div><div className="text-xs text-white/60">per month</div></div>
                <div><div className="text-lg font-medium">{formatINR(forecast.quarterly)}</div><div className="text-xs text-white/60">quarterly</div></div>
                <div><div className="text-lg font-medium">{formatINR(forecast.yearly)}</div><div className="text-xs text-white/60">yearly projection</div></div>
              </div>
            </div>
          </div>

          {history.length > 0 && (
            <div className="bg-card ring-1 ring-border rounded-2xl p-6">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-secondary mb-4">
                <History className="size-4" /> Planner History
              </div>
              <div className="space-y-2">
                {history.slice(0, 10).map((h) => (
                  <div key={h.id} className="flex items-center justify-between text-sm py-2 border-b border-border last:border-0">
                    <span><strong className="capitalize">{h.action}</strong> — {h.planTitle}</span>
                    <span className="text-xs text-muted-foreground">{new Date(h.timestamp).toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}

function BudgetRow({ label, amount, pct, accent }: { label: string; amount: number; pct: number; accent?: boolean }) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span>{label}</span>
        <span className={accent ? "text-savings font-medium" : "font-medium"}>{formatINR(amount)}</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${accent ? "bg-savings" : "bg-accent"}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
