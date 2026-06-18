import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { COUPONS, formatINR } from "@/lib/mock-data";
import { requireAuth } from "@/lib/route-guard";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Cart · Smart Deal" }] }),
  beforeLoad: () => requireAuth("/cart"),
  component: CartPage,
});

function CartPage() {
  const navigate = useNavigate();
  const { items, updateQty, remove } = useCart();
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const mrpTotal = items.reduce((sum, i) => sum + i.mrp * i.qty, 0);
  const savings = mrpTotal - subtotal;
  const delivery = subtotal > 999 ? 0 : 49;
  let couponDiscount = 0;
  if (appliedCoupon && COUPONS[appliedCoupon]) {
    const c = COUPONS[appliedCoupon];
    if (subtotal >= c.minOrder) {
      couponDiscount = c.type === "percent" ? Math.round(subtotal * c.discount / 100) : c.discount;
    }
  }
  const total = Math.max(0, subtotal + delivery - couponDiscount);

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (!COUPONS[code]) {
      setCouponError("Invalid coupon code. Try SMART10, SAVE500, WELCOME, or FLASH25.");
      return;
    }
    if (subtotal < COUPONS[code].minOrder) {
      setCouponError(`Minimum order ${formatINR(COUPONS[code].minOrder)} required.`);
      return;
    }
    setAppliedCoupon(code);
    setCouponError(null);
  };

  return (
    <AppShell
      header={{
        eyebrow: "Cart",
        title: "Review your cart",
        subtitle: `${items.length} item${items.length === 1 ? "" : "s"} ready for checkout`,
        breadcrumbs: [{ label: "Cart" }],
      }}
    >
      <div className="grid lg:grid-cols-[1fr_360px] gap-6 animate-slide-up">
        <div className="space-y-3">
          {items.length === 0 ? (
            <EmptyState
              icon={<ShoppingCart className="size-10 text-muted-foreground" />}
              title="Your cart is empty"
              description="Browse live deals and add items to get started."
              actionLabel="Browse deals"
              actionTo="/products"
            />
          ) : (
            items.map((i) => (
              <div key={i.id} className="bg-card ring-1 ring-border rounded-2xl p-4 flex items-center gap-4 shadow-card">
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
                    <button onClick={() => updateQty(i.id, i.qty - 1)} className="p-1.5 hover:bg-muted rounded-l-lg"><Minus className="size-3" /></button>
                    <span className="px-3 text-sm font-medium">{i.qty}</span>
                    <button onClick={() => updateQty(i.id, i.qty + 1)} className="p-1.5 hover:bg-muted rounded-r-lg"><Plus className="size-3" /></button>
                  </div>
                  <button onClick={() => remove(i.id)} className="text-xs text-destructive inline-flex items-center gap-1 hover:underline">
                    <Trash2 className="size-3" /> Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <aside className="bg-card ring-1 ring-border rounded-2xl p-6 h-fit shadow-card">
          <h3 className="font-medium">Order Summary</h3>
          <dl className="mt-5 space-y-2 text-sm">
            <Row label="Subtotal" value={formatINR(subtotal)} />
            <Row label="You saved" value={`− ${formatINR(savings)}`} accent />
            {couponDiscount > 0 && <Row label={`Coupon (${appliedCoupon})`} value={`− ${formatINR(couponDiscount)}`} accent />}
            <Row label="Delivery" value={delivery === 0 ? "Free" : formatINR(delivery)} />
            <div className="border-t pt-3 mt-3 flex items-baseline justify-between">
              <dt className="font-medium">Grand Total</dt>
              <dd className="text-xl font-semibold">{formatINR(total)}</dd>
            </div>
          </dl>
          <Button
            disabled={items.length === 0}
            onClick={() => navigate({ to: "/checkout", search: { coupon: appliedCoupon ?? undefined } })}
            className="mt-6 w-full h-12 bg-accent hover:bg-accent/90"
          >
            Proceed to Checkout
          </Button>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Coupon code" className="flex-1 bg-muted rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-accent" />
            <Button size="sm" onClick={applyCoupon}>Apply</Button>
          </div>
          {couponError && <p className="mt-2 text-xs text-destructive">{couponError}</p>}
          {appliedCoupon && <p className="mt-2 text-xs text-savings">Coupon {appliedCoupon} applied!</p>}
        </aside>
      </div>
    </AppShell>
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
