import { createFileRoute, Link } from "@tanstack/react-router";
import { Package, ShoppingBag, Store, TrendingUp, Undo2 } from "lucide-react";
import { DealerShell } from "@/components/dealer/DealerShell";
import { StatCard } from "@/components/common/StatCard";
import { formatINR } from "@/lib/mock-data";
import { getDealerAnalytics, getDealerDeals, getDealerOrders, getDealerPendingReturns, getDealerProducts, getDealerStore } from "@/services/dealer-service";
import { getDealerInventorySummary } from "@/services/dealer-service";
import { requireDealer } from "@/lib/route-guard";

export const Route = createFileRoute("/dealer/dashboard")({
  head: () => ({ meta: [{ title: "Dealer Dashboard · Smart Deal" }] }),
  beforeLoad: () => requireDealer(),
  component: DealerDashboardPage,
});

function DealerDashboardPage() {
  const analytics = getDealerAnalytics();
  const store = getDealerStore();
  const inv = getDealerInventorySummary();
  const pendingReturns = getDealerPendingReturns();

  return (
    <DealerShell title="Dashboard" subtitle={store?.name}>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Revenue" value={formatINR(analytics.revenue)} icon={<TrendingUp className="size-4 text-savings" />} />
        <StatCard label="Orders" value={String(analytics.orders)} icon={<ShoppingBag className="size-4 text-accent" />} />
        <StatCard label="Products" value={String(getDealerProducts().length)} icon={<Package className="size-4" />} />
        <StatCard label="Active Deals" value={String(getDealerDeals().length)} icon={<Store className="size-4" />} />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card ring-1 ring-border rounded-2xl p-6 shadow-card">
          <h3 className="font-medium mb-4">Inventory snapshot</h3>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div><dt className="text-muted-foreground">Available</dt><dd className="font-semibold text-lg">{inv.totalAvailable}</dd></div>
            <div><dt className="text-muted-foreground">Sold</dt><dd className="font-semibold text-lg">{inv.totalSold}</dd></div>
            <div><dt className="text-muted-foreground">Reserved</dt><dd className="font-semibold text-lg">{inv.totalReserved}</dd></div>
            <div><dt className="text-muted-foreground">Returned</dt><dd className="font-semibold text-lg">{inv.totalReturned}</dd></div>
          </dl>
          <Link to="/dealer/products" className="inline-block mt-4 text-sm text-accent font-medium">Manage inventory →</Link>
        </div>
        <div className="bg-card ring-1 ring-border rounded-2xl p-6 shadow-card">
          <h3 className="font-medium mb-4 flex items-center gap-2"><Undo2 className="size-4" /> Pending returns ({pendingReturns.length})</h3>
          {pendingReturns.length === 0 ? (
            <p className="text-sm text-muted-foreground">No pending return requests.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {pendingReturns.slice(0, 5).map((r) => (
                <li key={r.id} className="flex justify-between"><span>{r.productName}</span><span className="text-muted-foreground">{r.status}</span></li>
              ))}
            </ul>
          )}
          <Link to="/dealer/orders" className="inline-block mt-4 text-sm text-accent font-medium">Manage orders →</Link>
        </div>
      </div>
      <p className="mt-6 text-sm text-muted-foreground">Best seller: <strong>{analytics.bestProduct}</strong> · {analytics.productsSold} units sold</p>
    </DealerShell>
  );
}
