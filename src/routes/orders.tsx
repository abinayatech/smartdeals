import { createFileRoute } from "@tanstack/react-router";
import { FloatingNav } from "@/components/layout/FloatingNav";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";
import { formatINR } from "@/lib/mock-data";

export const Route = createFileRoute("/orders")({
  head: () => ({ meta: [{ title: "Orders · Smart Deal" }] }),
  component: OrdersPage,
});

const ORDERS = [
  { id: "SD-19284", store: "Blinkit", total: 1240, status: "Delivered", placed: "2 days ago" },
  { id: "SD-19170", store: "Croma", total: 24999, status: "Out for Delivery", placed: "4 hours ago" },
  { id: "SD-19044", store: "Nykaa", total: 1849, status: "Packed", placed: "1 day ago" },
  { id: "SD-18921", store: "Zudio", total: 1999, status: "Cancelled", placed: "1 week ago" },
];

const STATUSES = ["Placed", "Preparing", "Packed", "Out for Delivery", "Delivered"] as const;

function statusIndex(s: string) {
  return STATUSES.indexOf(s as (typeof STATUSES)[number]);
}

function OrdersPage() {
  return (
    <div className="min-h-screen bg-background">
      <FloatingNav />
      <PageHeader eyebrow="Orders" title="Track every order" subtitle="Live status updates from each of your stores." />
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto space-y-4">
          {ORDERS.map((o) => {
            const idx = statusIndex(o.status);
            const cancelled = o.status === "Cancelled";
            return (
              <div key={o.id} className="bg-card ring-1 ring-border rounded-2xl p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground">Order #{o.id} · {o.placed}</div>
                    <div className="font-medium mt-1">{o.store} · {formatINR(o.total)}</div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded font-medium ${cancelled ? "bg-destructive/10 text-destructive" : "bg-savings/10 text-savings"}`}>{o.status}</span>
                </div>
                {!cancelled && (
                  <div className="mt-6 flex items-center">
                    {STATUSES.map((s, i) => (
                      <div key={s} className="flex items-center flex-1 last:flex-none">
                        <div className={`size-2.5 rounded-full ${i <= idx ? "bg-accent" : "bg-border"}`} />
                        {i < STATUSES.length - 1 && <div className={`flex-1 h-0.5 ${i < idx ? "bg-accent" : "bg-border"}`} />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
      <Footer />
    </div>
  );
}