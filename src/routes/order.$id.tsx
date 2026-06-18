import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/mock-data";
import { getOrderById, ORDER_STATUSES, statusIndex } from "@/lib/orders-service";
import { getReturns, requestReturn } from "@/services/returns-service";
import { requireAuth } from "@/lib/route-guard";
import { useAuth } from "@/lib/auth-context";
import { notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/order/$id")({
  head: ({ params }) => ({ meta: [{ title: `Order ${params.id} · Smart Deal` }] }),
  beforeLoad: () => requireAuth("/orders"),
  loader: ({ params }) => {
    const order = getOrderById(params.id);
    if (!order) throw notFound();
    return { order };
  },
  component: OrderDetailPage,
});

function OrderDetailPage() {
  const { order } = Route.useLoaderData();
  const { user } = useAuth();
  const idx = statusIndex(order.status);
  const cancelled = order.status === "Cancelled";
  const [returnReason, setReturnReason] = useState("");
  const [returns, setReturns] = useState(() => (user ? getReturns(user.id) : []));
  const orderReturns = returns.filter((r) => r.orderId === order.id);

  return (
    <AppShell
      header={{
        eyebrow: "Order Tracking",
        title: `Order #${order.id}`,
        subtitle: `Placed ${new Date(order.placedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`,
        breadcrumbs: [{ label: "Orders", to: "/orders" }, { label: order.id }],
      }}
    >
      <div className="max-w-4xl mx-auto space-y-6 animate-slide-up">
        <div className="bg-card ring-1 ring-border rounded-2xl p-6 shadow-card">
          <div className="flex flex-wrap justify-between gap-4">
            <div>
              <div className="text-sm text-muted-foreground">{order.store}</div>
              <div className="text-2xl font-semibold mt-1">{formatINR(order.total)}</div>
            </div>
            <span className={`text-sm px-3 py-1 rounded-full font-medium ${cancelled ? "bg-destructive/10 text-destructive" : "bg-savings/10 text-savings"}`}>{order.status}</span>
          </div>
          {!cancelled && (
            <div className="mt-8">
              <div className="flex justify-between mb-2">
                {ORDER_STATUSES.map((s) => (
                  <span key={s} className={`text-[10px] font-medium text-center flex-1 ${statusIndex(s) <= idx ? "text-accent" : "text-muted-foreground"}`}>{s}</span>
                ))}
              </div>
              <div className="flex items-center">
                {ORDER_STATUSES.map((s, i) => (
                  <div key={s} className="flex items-center flex-1 last:flex-none">
                    <div className={`size-3 rounded-full ${i <= idx ? "bg-accent" : "bg-border"}`} />
                    {i < ORDER_STATUSES.length - 1 && <div className={`flex-1 h-1 ${i < idx ? "bg-accent" : "bg-border"}`} />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-card ring-1 ring-border rounded-2xl p-6 shadow-card">
          <h3 className="font-medium mb-4">Items</h3>
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <img src={item.image} alt={item.name} className="size-14 rounded-xl object-cover" />
                <div className="flex-1">
                  <div className="font-medium text-sm">{item.name}</div>
                  <div className="text-xs text-muted-foreground">Qty: {item.qty}</div>
                </div>
                <div className="font-medium">{formatINR(item.price * item.qty)}</div>
              </div>
            ))}
          </div>
        </div>

        {order.status === "Delivered" && (
          <div className="bg-card ring-1 ring-border rounded-2xl p-6 shadow-card">
            <h3 className="font-medium mb-3">Returns & Refunds</h3>
            {orderReturns.length > 0 ? (
              <ul className="space-y-2 text-sm">
                {orderReturns.map((r) => (
                  <li key={r.id} className="flex justify-between">
                    <span>{r.productName}</span>
                    <span className={`font-medium ${r.status === "Refunded" ? "text-savings" : r.status === "Rejected" ? "text-destructive" : "text-warning"}`}>{r.status}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="space-y-3">
                <input value={returnReason} onChange={(e) => setReturnReason(e.target.value)} placeholder="Reason for return…" className="w-full bg-muted/50 rounded-xl px-4 py-2.5 text-sm ring-1 ring-border" />
                <Button variant="outline" onClick={() => {
                  const item = order.items[0];
                  if (!item || !returnReason.trim()) return;
                  requestReturn(order.id, item.productId, item.name, returnReason.trim());
                  setReturns(user ? getReturns(user.id) : []);
                  setReturnReason("");
                }}>Request return</Button>
              </div>
            )}
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div className="bg-card ring-1 ring-border rounded-2xl p-5 shadow-card">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Delivery</div>
            <div className="font-medium mt-1 capitalize">{order.deliveryType}</div>
            <div className="text-muted-foreground mt-1">{order.address}</div>
          </div>
          <div className="bg-card ring-1 ring-border rounded-2xl p-5 shadow-card">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Payment</div>
            <div className="font-medium mt-1">{order.paymentMethod}</div>
            <div className="text-savings mt-1">Saved {formatINR(order.discount)}</div>
          </div>
        </div>

        <Link to="/orders" className="inline-flex px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm">← Back to Orders</Link>
      </div>
    </AppShell>
  );
}
