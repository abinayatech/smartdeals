import { createFileRoute } from "@tanstack/react-router";
import { Calendar, Sparkles, TrendingDown } from "lucide-react";
import { FloatingNav } from "@/components/layout/FloatingNav";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";
import { formatINR, products } from "@/lib/mock-data";

export const Route = createFileRoute("/ai-planner")({
  head: () => ({ meta: [{ title: "AI Planner · Smart Deal" }] }),
  component: PlannerPage,
});

const PLANS = [
  { id: "cheapest", title: "Cheapest Plan", desc: "Visit 3 stores · 12 km", savings: 2450, time: "~85 min" },
  { id: "fastest", title: "Fastest Plan", desc: "1 store, instant delivery", savings: 980, time: "~20 min" },
  { id: "hybrid", title: "Hybrid Plan", desc: "2 stores + 1 delivery", savings: 1820, time: "~45 min" },
];

function PlannerPage() {
  return (
    <div className="min-h-screen bg-background">
      <FloatingNav />
      <PageHeader eyebrow="Intelligence" title="Your AI Shopping Planner" subtitle="We predict the best date, store and combo to maximize your savings." />
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="grid md:grid-cols-3 gap-4">
            {PLANS.map((p) => (
              <div key={p.id} className="bg-card ring-1 ring-border rounded-2xl p-6 hover:ring-accent/40 transition-all">
                <div className="flex items-center gap-2 text-xs font-semibold text-accent uppercase tracking-wider">
                  <Sparkles className="size-3.5" /> {p.title}
                </div>
                <div className="mt-4 text-2xl font-semibold text-savings">{formatINR(p.savings)}</div>
                <div className="text-xs text-muted-foreground">potential savings · {p.time}</div>
                <p className="text-sm text-secondary mt-4">{p.desc}</p>
                <button className="mt-5 w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">Activate Plan</button>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-card ring-1 ring-border rounded-2xl p-6">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-secondary">
                <Calendar className="size-4" /> Best Days to Buy
              </div>
              <div className="mt-5 space-y-3">
                {products.slice(0, 4).map((p) => (
                  <div key={p.id} className="flex items-center gap-4 p-3 bg-muted rounded-xl">
                    <img src={p.image} alt={p.name} loading="lazy" className="size-12 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{p.name}</div>
                      <div className="text-xs text-muted-foreground">Wait until Saturday · expected drop ~12%</div>
                    </div>
                    <TrendingDown className="size-4 text-savings shrink-0" />
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-primary text-primary-foreground rounded-2xl p-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-accent">This Week's AI Brief</div>
              <h3 className="text-2xl font-medium mt-3 max-w-md">Three actions that will save you ₹4,820 this week.</h3>
              <ul className="mt-6 space-y-3 text-sm text-white/80">
                <li>• Move your weekly grocery to Blinkit (–12% on staples).</li>
                <li>• Reserve the QuietComfort Ultra at Croma before Saturday's flash deal.</li>
                <li>• Use the Hybrid Plan to combine pickup + delivery and avoid two delivery fees.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}