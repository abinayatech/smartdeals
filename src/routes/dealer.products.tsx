import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DealerShell } from "@/components/dealer/DealerShell";
import { formatINR } from "@/lib/mock-data";
import { getDealerProducts, getDealerStoreId } from "@/services/dealer-service";
import { getInventory, updateInventory } from "@/services/inventory-service";
import { requireDealer } from "@/lib/route-guard";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dealer/products")({
  head: () => ({ meta: [{ title: "Dealer Products · Smart Deal" }] }),
  beforeLoad: () => requireDealer(),
  component: DealerProductsPage,
});

function DealerProductsPage() {
  const storeId = getDealerStoreId();
  const [products] = useState(() => getDealerProducts().slice(0, 50));
  const [, bump] = useState(0);
  const refresh = () => bump((n) => n + 1);

  return (
    <DealerShell title="Product & Inventory Management" subtitle="Manage catalog and stock levels">
      <div className="overflow-x-auto bg-card ring-1 ring-border rounded-2xl shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="p-3 font-medium">Product</th>
              <th className="p-3 font-medium">Price</th>
              <th className="p-3 font-medium">Available</th>
              <th className="p-3 font-medium">Sold</th>
              <th className="p-3 font-medium">Reserved</th>
              <th className="p-3 font-medium">Returned</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const inv = getInventory(p.id, storeId);
              return (
                <tr key={p.id} className="border-t border-border">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt="" className="size-10 rounded-lg object-cover" />
                      <span className="font-medium truncate max-w-[200px]">{p.name}</span>
                    </div>
                  </td>
                  <td className="p-3">{formatINR(p.price)}</td>
                  <td className="p-3">{inv?.stockAvailable ?? 0}</td>
                  <td className="p-3">{inv?.stockSold ?? 0}</td>
                  <td className="p-3">{inv?.reservedStock ?? 0}</td>
                  <td className="p-3">{inv?.returnedStock ?? 0}</td>
                  <td className="p-3">
                    <Button size="sm" variant="outline" onClick={() => { updateInventory(p.id, storeId, { stockAvailable: (inv?.stockAvailable ?? 0) + 10 }); refresh(); }}>+10 stock</Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DealerShell>
  );
}
