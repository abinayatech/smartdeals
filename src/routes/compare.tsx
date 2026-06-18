import { createFileRoute, Link } from "@tanstack/react-router";
import { GitCompare, Trash2 } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { getCompareList, removeFromCompare, clearCompare } from "@/lib/compare-service";
import { formatINR, getProductById } from "@/lib/mock-data";
import { useCart } from "@/hooks/use-cart";

export const Route = createFileRoute("/compare")({
  head: () => ({ meta: [{ title: "Compare Products · Smart Deal" }] }),
  component: ComparePage,
});

function ComparePage() {
  const [ids, setIds] = useState(() => getCompareList());
  const { add } = useCart();
  const products = ids.map((id) => getProductById(id)).filter(Boolean);

  const refresh = () => setIds(getCompareList());

  return (
    <AppShell
      header={{
        eyebrow: "Compare",
        title: "Product comparison",
        subtitle: "Compare up to 3 products side by side.",
        breadcrumbs: [{ label: "Compare" }],
        actions: ids.length > 0 ? (
          <Button variant="outline" size="sm" onClick={() => { clearCompare(); refresh(); }}>
            Clear all
          </Button>
        ) : undefined,
      }}
    >
      {products.length === 0 ? (
        <EmptyState
          icon={<GitCompare className="size-10 text-muted-foreground" />}
          title="No products to compare"
          description="Add products from the product detail page using Compare."
          actionLabel="Browse deals"
          actionTo="/products"
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-4 text-left font-medium text-muted-foreground w-32">Attribute</th>
                {products.map((p) => p && (
                  <th key={p.id} className="p-4 text-left min-w-[200px]">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-medium line-clamp-2">{p.name}</span>
                      <button onClick={() => { removeFromCompare(p.id); refresh(); }} className="text-muted-foreground hover:text-destructive shrink-0">
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <CompareRow label="Image" products={products} cell={(p) => <img src={p.image} alt="" className="size-20 rounded-xl object-cover" />} />
              <CompareRow label="Price" products={products} cell={(p) => <span className="font-semibold text-lg">{formatINR(p.price)}</span>} />
              <CompareRow label="MRP" products={products} cell={(p) => <span className="line-through text-muted-foreground">{formatINR(p.mrp)}</span>} />
              <CompareRow label="Store" products={products} cell={(p) => p.store} />
              <CompareRow label="Rating" products={products} cell={(p) => `${p.rating} ★ (${p.reviews})`} />
              <CompareRow label="Deal score" products={products} cell={(p) => p.dealScore.toFixed(1)} />
              <CompareRow label="Delivery" products={products} cell={(p) => p.delivery ?? "—"} />
              <tr>
                <td className="p-4 font-medium text-muted-foreground">Actions</td>
                {products.map((p) => p && (
                  <td key={p.id} className="p-4 space-y-2">
                    <Link to="/product/$id" params={{ id: p.id }} className="text-accent text-sm font-medium hover:underline">View details</Link>
                    <Button size="sm" className="w-full" onClick={() => add(p, 1)}>Add to cart</Button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  );
}

function CompareRow<T extends { id: string }>({
  label,
  products,
  cell,
}: {
  label: string;
  products: (T | undefined)[];
  cell: (p: T) => React.ReactNode;
}) {
  return (
    <tr className="border-b border-border/60">
      <td className="p-4 font-medium text-muted-foreground">{label}</td>
      {products.map((p) => p && <td key={p.id} className="p-4">{cell(p)}</td>)}
    </tr>
  );
}
