import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { FloatingNav } from "@/components/layout/FloatingNav";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";
import { formatINR, products } from "@/lib/mock-data";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Cart · Smart Deal" }] }),
  component: CartPage,
});

function CartPage() {
  const [items, setItems] = useState(() =>
    products.slice(0, 3).map((p) => ({ ...p, qty: 1 })),
  );

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const mrpTotal = items.reduce((sum, i) => sum + i.mrp * i.qty, 0);
  const savings = mrpTotal - subtotal;
  const delivery = subtotal > 999 ? 0 : 49;
  const total = subtotal + delivery;

  return (
    <div className="min-h-screen bg-background">
      <FloatingNav />
      <PageHeader eyebrow="Cart" title="Review your cart" subtitle={`${items.length} item${items.length === 1 ? "" : "s"} ready for checkout`} />
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_360px] gap-6">
          <div className="space-y-3">
            {items.length === 0 && (
              <div className="text-center py-20 bg-card ring-1 ring-border rounded-2xl">
                <div className="text-4xl">🛒</div>
                <h3 className="mt-3 font-medium">Your cart is empty</h3>
                <Link to="/products" className="mt-5 inline-flex px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm">Browse deals</Link>
              </div>
            )}
            {items.map((i) => (
              <div key={i.id} className="bg-card ring-1 ring-border rounded-2xl p-4 flex items-center gap-4">
                <img src={i.image} alt={i.name} loading="lazy" className="size-20 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{i.name}</div>
                  <div className="text-xs text-muted-foreground">{i.store}</div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="font-semibold">{formatINR(i.price)}</span>
                    <span className="text-xs text-muted-foreground line-through">{formatINR(i.mrp)}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="inline-flex items-center ring-1 ring-border rounded-lg">
                    <button onClick={() => setItems((arr) => arr.map((x) => x.id === i.id ? { ...x, qty: Math.max(1, x.qty - 1) } : x))} className="p-1.5"><Minus className="size-3" /></button>
                    <span className="px-3 text-sm font-medium">{i.qty}</span>
                    <button onClick={() => setItems((arr) => arr.map((x) => x.id === i.id ? { ...x, qty: x.qty + 1 } : x))} className="p-1.5"><Plus className="size-3" /></button>
                  </div>
                  <button onClick={() => setItems((arr) => arr.filter((x) => x.id !== i.id))} className="text-xs text-destructive inline-flex items-center gap-1 hover:underline">
                    <Trash2 className="size-3" /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <aside className="bg-card ring-1 ring-border rounded-2xl p-6 h-fit">
            <h3 className="font-medium">Order Summary</h3>
            <dl className="mt-5 space-y-2 text-sm">
              <Row label="Subtotal" value={formatINR(subtotal)} />
              <Row label="You saved" value={`− ${formatINR(savings)}`} accent />
              <Row label="Delivery" value={delivery === 0 ? "Free" : formatINR(delivery)} />
              <div className="border-t pt-3 mt-3 flex items-baseline justify-between">
                <dt className="font-medium">Grand Total</dt>
                <dd className="text-xl font-semibold">{formatINR(total)}</dd>
              </div>
            </dl>
            <button disabled={items.length === 0} className="mt-6 w-full py-3 bg-accent text-accent-foreground rounded-xl font-semibold disabled:opacity-50">Proceed to Checkout</button>
            <div className="mt-3 flex items-center gap-2 text-xs">
              <input placeholder="Coupon code" className="flex-1 bg-muted rounded-lg px-3 py-2" />
              <button className="px-3 py-2 bg-primary text-primary-foreground rounded-lg font-medium">Apply</button>
            </div>
          </aside>
        </div>
      </section>
      <Footer />
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={accent ? "text-savings font-medium" : "font-medium"}>{value}</dd>
    </div>
  );
}