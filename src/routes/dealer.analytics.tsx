import { createFileRoute } from "@tanstack/react-router";
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DealerShell } from "@/components/dealer/DealerShell";
import { StatCard } from "@/components/common/StatCard";
import { formatINR } from "@/lib/mock-data";
import { getDealerAnalytics, getDealerOrders } from "@/services/dealer-service";
import { requireDealer } from "@/lib/route-guard";
import { TrendingUp, Package, ShoppingBag, Star } from "lucide-react";

export const Route = createFileRoute("/dealer/analytics")({
  head: () => ({ meta: [{ title: "Dealer Analytics · Smart Deal" }] }),
  beforeLoad: () => requireDealer(),
  component: DealerAnalyticsPage,
});

function DealerAnalyticsPage() {
  const analytics = getDealerAnalytics();
  const orders = getDealerOrders();
  const monthly = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month, i) => ({
    month,
    revenue: Math.round(analytics.revenue * (0.12 + i * 0.02)),
    orders: Math.round(orders.length * (0.1 + i * 0.015)),
  }));

  return (
    <DealerShell title="Dealer Analytics" subtitle="Revenue, orders and store performance">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Revenue" value={formatINR(analytics.revenue)} icon={<TrendingUp className="size-4 text-savings" />} />
        <StatCard label="Orders" value={String(analytics.orders)} icon={<ShoppingBag className="size-4 text-accent" />} />
        <StatCard label="Products Sold" value={String(analytics.productsSold)} icon={<Package className="size-4" />} />
        <StatCard label="Store Rating" value={String(analytics.storePerformance.rating)} icon={<Star className="size-4 text-warning" />} />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card ring-1 ring-border rounded-2xl p-6 shadow-card">
          <h3 className="font-medium mb-4">Revenue trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthly}>
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => formatINR(v)} />
              <Area type="monotone" dataKey="revenue" stroke="#16A34A" fill="#16A34A33" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card ring-1 ring-border rounded-2xl p-6 shadow-card">
          <h3 className="font-medium mb-4">Orders by month</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthly}>
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="orders" fill="#EA580C" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="mt-6 bg-card ring-1 ring-border rounded-2xl p-6 shadow-card">
        <h3 className="font-medium">Store performance</h3>
        <dl className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div><dt className="text-muted-foreground">Store</dt><dd className="font-semibold">{analytics.storePerformance.storeName}</dd></div>
          <div><dt className="text-muted-foreground">Best product</dt><dd className="font-semibold">{analytics.bestProduct}</dd></div>
          <div><dt className="text-muted-foreground">Total revenue</dt><dd className="font-semibold">{formatINR(analytics.storePerformance.revenue)}</dd></div>
          <div><dt className="text-muted-foreground">Total orders</dt><dd className="font-semibold">{analytics.storePerformance.orders}</dd></div>
        </dl>
      </div>
    </DealerShell>
  );
}
