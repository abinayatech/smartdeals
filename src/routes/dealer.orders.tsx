import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { DealerShell } from "@/components/dealer/DealerShell";
import { formatINR } from "@/lib/mock-data";
import { getDealerOrders, getDealerStoreId } from "@/services/dealer-service";
import { approveReturn, getStoreReturns, rejectReturn } from "@/services/returns-service";
import { requireDealer } from "@/lib/route-guard";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dealer/orders")({
  head: () => ({ meta: [{ title: "Dealer Orders · Smart Deal" }] }),
  beforeLoad: () => requireDealer(),
  component: DealerOrdersPage,
});

function DealerOrdersPage() {
  const storeId = getDealerStoreId();
  const [orders] = useState(() => getDealerOrders().slice(0, 30));
  const [returns, setReturns] = useState(() => getStoreReturns(storeId));
  const refreshReturns = () => setReturns(getStoreReturns(storeId));

  return (
    <DealerShell title="Order Management" subtitle="Track orders and process returns">
      <h3 className="font-medium mb-4">Recent orders</h3>
      <div className="space-y-3 mb-10">
        {orders.map((o) => (
          <div key={o.id} className="bg-card ring-1 ring-border rounded-xl p-4 flex flex-wrap justify-between gap-3 shadow-card">
            <div>
              <div className="font-medium">{o.id}</div>
              <div className="text-xs text-muted-foreground">{o.items.length} items · {formatINR(o.total)}</div>
            </div>
            <span className="text-xs px-2 py-1 rounded bg-muted font-medium">{o.status}</span>
          </div>
        ))}
      </div>

      <h3 className="font-medium mb-4">Return requests</h3>
      <div className="space-y-3">
        {returns.length === 0 && <p className="text-sm text-muted-foreground">No return requests.</p>}
        {returns.map((r) => (
          <div key={r.id} className="bg-card ring-1 ring-border rounded-xl p-4 shadow-card">
            <div className="flex flex-wrap justify-between gap-2">
              <div>
                <div className="font-medium">{r.productName}</div>
                <div className="text-xs text-muted-foreground">Order {r.orderId} · {r.reason}</div>
              </div>
              <span className={`text-xs px-2 py-1 rounded font-medium ${r.status === "Refunded" ? "bg-savings/10 text-savings" : r.status === "Rejected" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"}`}>{r.status}</span>
            </div>
            {r.status === "Requested" && (
              <div className="flex gap-2 mt-3">
                <Button size="sm" onClick={() => { approveReturn(r.id, storeId); refreshReturns(); }}>Approve</Button>
                <Button size="sm" variant="outline" className="text-destructive" onClick={() => { rejectReturn(r.id); refreshReturns(); }}>Reject</Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </DealerShell>
  );
}
