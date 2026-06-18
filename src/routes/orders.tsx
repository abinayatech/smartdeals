import { createFileRoute, Link } from "@tanstack/react-router";
import { FloatingNav } from "@/components/layout/FloatingNav";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";
import { formatINR } from "@/lib/mock-data";
import { getOrders, ORDER_STATUSES, statusIndex } from "@/lib/orders-service";
import { useAuth } from "@/lib/auth-context";
import { requireAuth } from "@/lib/route-guard";

export const Route = createFileRoute("/orders")({
  head: () => ({ meta: [{ title: "Orders · Smart Deal" }] }),
  beforeLoad: () => requireAuth("/orders"),
  component: OrdersPage,
});

function OrdersPage() {
  const { user } = useAuth();
  const orders = user ? getOrders(user.id) : [];

  return (
    <div className="min-h-screen bg-background">
      <FloatingNav />
      <PageHeader eyebrow="Orders" title="Track every order" subtitle={`${orders.length} orders in your history`} breadcrumbs={[{ label: "Orders" }]} />
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto space-y-4">
          {orders.length === 0 && (
            <div className="text-center py-16 bg-card ring-1 ring-border rounded-2xl">
              <p className="text-muted-foreground">No orders yet.</p>
              <Link to="/products" className="mt-4 inline-flex px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm">Start shopping</Link>
            </div>
          )}
          {orders.map((o) => {
            const idx = statusIndex(o.status);
            const cancelled = o.status === "Cancelled";
            return (
              <Link key={o.id} to="/order/$id" params={{ id: o.id }} className="block bg-card ring-1 ring-border rounded-2xl p-6 hover:ring-accent/40 transition-all">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground">Order #{o.id} · {new Date(o.placedAt).toLocaleDateString("en-IN")}</div>
                    <div className="font-medium mt-1">{o.store} · {formatINR(o.total)}</div>
                    <div className="text-xs text-muted-foreground mt-1">{o.items.length} item{o.items.length !== 1 ? "s" : ""} · {o.paymentMethod}</div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded font-medium ${cancelled ? "bg-destructive/10 text-destructive" : "bg-savings/10 text-savings"}`}>{o.status}</span>
                </div>
                {!cancelled && (
                  <div className="mt-6 flex items-center">
                    {ORDER_STATUSES.map((s, i) => (
                      <div key={s} className="flex items-center flex-1 last:flex-none">
                        <div className={`size-2.5 rounded-full ${i <= idx ? "bg-accent" : "bg-border"}`} />
                        {i < ORDER_STATUSES.length - 1 && <div className={`flex-1 h-0.5 ${i < idx ? "bg-accent" : "bg-border"}`} />}
                      </div>
                    ))}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </section>
      <Footer />
    </div>
  );
}
