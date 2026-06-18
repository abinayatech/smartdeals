import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DealerShell } from "@/components/dealer/DealerShell";
import { getDealerStore, updateStoreInfo } from "@/services/dealer-service";
import { getDealsForStore } from "@/lib/mock-data";
import { requireDealer } from "@/lib/route-guard";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dealer/store")({
  head: () => ({ meta: [{ title: "Dealer Store · Smart Deal" }] }),
  beforeLoad: () => requireDealer(),
  component: DealerStorePage,
});

function DealerStorePage() {
  const store = getDealerStore();
  const deals = store ? getDealsForStore(store.id).slice(0, 10) : [];
  const [delivery, setDelivery] = useState(store?.delivery ?? true);
  const [pickup, setPickup] = useState(store?.pickup ?? true);
  const [msg, setMsg] = useState<string | null>(null);

  if (!store) return <DealerShell title="Store"><p>Store not found.</p></DealerShell>;

  return (
    <DealerShell title="Store Management" subtitle={store.name}>
      {msg && <div className="mb-4 p-3 bg-savings/10 text-savings rounded-xl text-sm">{msg}</div>}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card ring-1 ring-border rounded-2xl p-6 shadow-card space-y-4">
          <div className="flex items-center gap-4">
            <img src={store.logo} alt="" className="size-16 rounded-xl" />
            <div>
              <h3 className="font-semibold text-lg">{store.name}</h3>
              <p className="text-sm text-muted-foreground">{store.address}</p>
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div><dt className="text-muted-foreground">Rating</dt><dd className="font-medium">⭐ {store.rating}</dd></div>
            <div><dt className="text-muted-foreground">Deals</dt><dd className="font-medium">{store.dealCount}</dd></div>
            <div><dt className="text-muted-foreground">City</dt><dd className="font-medium">{store.city}</dd></div>
            <div><dt className="text-muted-foreground">Reviews</dt><dd className="font-medium">{store.reviewCount.toLocaleString()}</dd></div>
          </dl>
          <div className="flex flex-wrap gap-4 pt-2">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={delivery} onChange={(e) => setDelivery(e.target.checked)} /> Delivery</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={pickup} onChange={(e) => setPickup(e.target.checked)} /> Pickup</label>
          </div>
          <Button onClick={() => { updateStoreInfo({ delivery, pickup }); setMsg("Store settings saved."); }}>Save settings</Button>
        </div>
        <div className="bg-card ring-1 ring-border rounded-2xl p-6 shadow-card">
          <h3 className="font-medium mb-4">Active deals ({deals.length})</h3>
          <ul className="space-y-2 text-sm max-h-80 overflow-y-auto">
            {deals.map((d) => (
              <li key={d.id} className="flex justify-between py-2 border-b border-border last:border-0">
                <span className="truncate flex-1">{d.title}</span>
                <span className="text-discount font-medium ml-2">{d.discount}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DealerShell>
  );
}
