import { createFileRoute, Link } from "@tanstack/react-router";
import { Flame, Timer, TrendingUp, Zap } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { DealCard } from "@/components/deals/DealCard";
import { DealCountdown } from "@/components/deals/DealCountdown";
import { deals, getProductById, formatINR } from "@/lib/mock-data";

export const Route = createFileRoute("/deals")({
  head: () => ({ meta: [{ title: "Deals · Smart Deal" }, { name: "description", content: "Flash sales, best deals and limited offers with live countdowns." }] }),
  component: DealsPage,
});

function DealsPage() {
  const flash = deals.filter((d) => d.type === "flash");
  const best = deals.filter((d) => d.type === "best");
  const limited = deals.filter((d) => d.type === "limited");

  return (
    <AppShell
      header={{
        eyebrow: "Live Deals",
        title: "Today's hottest deals",
        subtitle: `${deals.length} active deals · stock & countdowns update live`,
        breadcrumbs: [{ label: "Deals" }],
      }}
    >
      <div className="space-y-12 animate-slide-up">
        <DealSection title="Flash Sales" icon={<Zap className="size-4 text-discount" />} items={flash.slice(0, 12)} />
        <DealSection title="Best Deals" icon={<TrendingUp className="size-4 text-savings" />} items={best.slice(0, 12)} />
        <DealSection title="Limited Offers" icon={<Flame className="size-4 text-warning" />} items={limited.slice(0, 12)} />
        <div className="text-center">
          <Link to="/deal-map" className="inline-flex px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium">View on Deal Map →</Link>
        </div>
      </div>
    </AppShell>
  );
}

function DealSection({ title, icon, items }: { title: string; icon: React.ReactNode; items: typeof deals }) {
  return (
    <section>
      <h2 className="text-xl font-medium mb-6 flex items-center gap-2">{icon} {title}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        {items.slice(0, 6).map((d) => {
          const p = getProductById(d.productId);
          if (!p) return null;
          return (
            <div key={d.id} className="bg-card ring-1 ring-border rounded-2xl p-4 shadow-card flex gap-4">
              <img src={p.image} alt={p.name} className="size-20 rounded-xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold uppercase text-discount">{d.type} · {d.discount}% off</div>
                <div className="font-medium text-sm truncate mt-0.5">{p.name}</div>
                <div className="text-lg font-semibold mt-1">{formatINR(p.price)}</div>
                <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Timer className="size-3" /> <DealCountdown expiresAt={d.expiresAt} /></span>
                  <span>{d.stockRemaining} left</span>
                  <span>🔥 {d.popularity}% popular</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((d) => {
          const p = getProductById(d.productId);
          return p ? <DealCard key={d.id} product={p} /> : null;
        })}
      </div>
    </section>
  );
}
