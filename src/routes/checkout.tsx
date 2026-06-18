import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, CreditCard, Smartphone, Building2, Wallet, Banknote, MapPin, Truck, Store } from "lucide-react";
import { useEffect, useState } from "react";
import { FloatingNav } from "@/components/layout/FloatingNav";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";
import { useAuth } from "@/lib/auth-context";
import { getCart, clearCart } from "@/lib/cart-service";
import { COUPONS, formatINR } from "@/lib/mock-data";
import { createOrderId, saveOrder } from "@/lib/orders-service";
import { addNotification } from "@/lib/notifications-service";
import { getAddresses } from "@/lib/settings-service";
import { requireAuth } from "@/lib/route-guard";
import { KEYS, writeJSON } from "@/lib/storage";

type Search = { coupon?: string };

const PAYMENT_METHODS = [
  { id: "upi", label: "UPI", icon: Smartphone },
  { id: "credit", label: "Credit Card", icon: CreditCard },
  { id: "debit", label: "Debit Card", icon: CreditCard },
  { id: "netbanking", label: "Net Banking", icon: Building2 },
  { id: "wallet", label: "Wallet", icon: Wallet },
  { id: "cod", label: "Cash On Delivery", icon: Banknote },
] as const;

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout · Smart Deal" }] }),
  validateSearch: (s: Record<string, unknown>): Search => ({ coupon: typeof s.coupon === "string" ? s.coupon : undefined }),
  beforeLoad: () => requireAuth("/checkout"),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { coupon } = Route.useSearch();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<"address" | "delivery" | "payment" | "processing" | "result">("address");
  const [addresses] = useState(() => getAddresses());
  const [selectedAddr, setSelectedAddr] = useState(addresses.find((a) => a.isDefault)?.id ?? addresses[0]?.id);
  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">("delivery");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [paymentResult, setPaymentResult] = useState<"success" | "failure" | null>(null);
  const [orderId, setOrderId] = useState("");
  const items = getCart();

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery = deliveryType === "pickup" ? 0 : subtotal > 999 ? 0 : 49;
  let couponDiscount = 0;
  if (coupon && COUPONS[coupon] && subtotal >= COUPONS[coupon].minOrder) {
    const c = COUPONS[coupon];
    couponDiscount = c.type === "percent" ? Math.round(subtotal * c.discount / 100) : c.discount;
  }
  const total = Math.max(0, subtotal + delivery - couponDiscount);

  useEffect(() => {
    if (items.length === 0 && step !== "result") navigate({ to: "/cart" });
  }, [items.length, step, navigate]);

  const processPayment = (simulate: "success" | "failure") => {
    setStep("processing");
    setTimeout(() => {
      if (simulate === "failure") {
        setPaymentResult("failure");
        setStep("result");
        return;
      }
      const id = createOrderId();
      const addr = addresses.find((a) => a.id === selectedAddr);
      const store = items[0]?.store ?? "Smart Deal";
      const order = {
        id,
        userId: user!.id,
        store,
        storeId: items[0]?.storeId ?? "s1",
        items: items.map((i) => ({ productId: i.id, name: i.name, qty: i.qty, price: i.price, image: i.image })),
        subtotal,
        delivery,
        discount: couponDiscount + items.reduce((s, i) => s + (i.mrp - i.price) * i.qty, 0),
        total,
        status: "Placed" as const,
        placedAt: new Date().toISOString(),
        paymentMethod: PAYMENT_METHODS.find((p) => p.id === paymentMethod)?.label ?? "UPI",
        address: addr ? `${addr.line1}, ${addr.city} ${addr.pincode}` : "Pickup",
        deliveryType,
      };
      saveOrder(order);
      addNotification({
        id: crypto.randomUUID(),
        userId: user!.id,
        type: "order",
        title: `Order ${id} placed successfully`,
        body: `Your order of ${formatINR(total)} has been confirmed.`,
        read: false,
        createdAt: new Date().toISOString(),
      });
      writeJSON(KEYS.lastReceipt, { order, paidAt: new Date().toISOString() });
      clearCart();
      setOrderId(id);
      setPaymentResult("success");
      setStep("result");
    }, 2000);
  };

  if (step === "processing") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="size-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 font-medium">Processing payment…</p>
          <p className="text-sm text-muted-foreground mt-1">Please do not close this window.</p>
        </div>
      </div>
    );
  }

  if (step === "result") {
    return (
      <div className="min-h-screen bg-background">
        <FloatingNav />
        <PageHeader title={paymentResult === "success" ? "Payment Successful!" : "Payment Failed"} subtitle={paymentResult === "success" ? `Order ${orderId} confirmed` : "Your payment could not be processed."} breadcrumbs={[{ label: "Cart", to: "/cart" }, { label: "Checkout" }]} />
        <section className="px-6 pb-24">
          <div className="max-w-lg mx-auto text-center bg-card ring-1 ring-border rounded-2xl p-8">
            <div className={`size-16 rounded-full mx-auto grid place-items-center ${paymentResult === "success" ? "bg-savings/10 text-savings" : "bg-destructive/10 text-destructive"}`}>
              {paymentResult === "success" ? <Check className="size-8" /> : <span className="text-2xl">✕</span>}
            </div>
            {paymentResult === "success" ? (
              <>
                <h2 className="mt-4 text-xl font-medium">Thank you for your order!</h2>
                <p className="text-sm text-muted-foreground mt-2">Order ID: <strong>{orderId}</strong></p>
                <p className="text-sm text-muted-foreground">Amount paid: <strong>{formatINR(total)}</strong></p>
                <div className="mt-6 flex flex-col gap-2">
                  <Link to="/order/$id" params={{ id: orderId }} className="py-3 bg-primary text-primary-foreground rounded-xl font-medium">Track Order</Link>
                  <Link to="/orders" className="py-3 ring-1 ring-border rounded-xl font-medium">View All Orders</Link>
                  <Link to="/products" className="py-3 text-accent font-medium">Continue Shopping</Link>
                </div>
              </>
            ) : (
              <>
                <h2 className="mt-4 text-xl font-medium">Payment could not be completed</h2>
                <p className="text-sm text-muted-foreground mt-2">Please try again or choose a different payment method.</p>
                <div className="mt-6 flex flex-col gap-2">
                  <button onClick={() => { setStep("payment"); setPaymentResult(null); }} className="py-3 bg-accent text-accent-foreground rounded-xl font-medium">Retry Payment</button>
                  <Link to="/cart" className="py-3 ring-1 ring-border rounded-xl font-medium">Back to Cart</Link>
                </div>
              </>
            )}
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <FloatingNav />
      <PageHeader eyebrow="Checkout" title="Complete your order" subtitle={`${items.length} items · ${formatINR(total)}`} breadcrumbs={[{ label: "Cart", to: "/cart" }, { label: "Checkout" }]} />
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_360px] gap-6">
          <div className="space-y-6">
            {step === "address" && (
              <div className="bg-card ring-1 ring-border rounded-2xl p-6">
                <h3 className="font-medium flex items-center gap-2"><MapPin className="size-4" /> Select Address</h3>
                <div className="mt-4 space-y-3">
                  {addresses.map((a) => (
                    <label key={a.id} className={`block p-4 rounded-xl ring-1 cursor-pointer ${selectedAddr === a.id ? "ring-accent bg-accent/5" : "ring-border"}`}>
                      <input type="radio" name="addr" checked={selectedAddr === a.id} onChange={() => setSelectedAddr(a.id)} className="sr-only" />
                      <div className="font-medium">{a.label}</div>
                      <div className="text-sm text-muted-foreground">{a.line1}, {a.city} {a.pincode}</div>
                    </label>
                  ))}
                </div>
                <button onClick={() => setStep("delivery")} className="mt-5 w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium">Continue</button>
              </div>
            )}

            {step === "delivery" && (
              <div className="bg-card ring-1 ring-border rounded-2xl p-6">
                <h3 className="font-medium">Delivery Options</h3>
                <div className="mt-4 grid sm:grid-cols-2 gap-3">
                  <button onClick={() => setDeliveryType("delivery")} className={`p-4 rounded-xl ring-1 text-left ${deliveryType === "delivery" ? "ring-accent bg-accent/5" : "ring-border"}`}>
                    <Truck className="size-5 mb-2" />
                    <div className="font-medium">Home Delivery</div>
                    <div className="text-xs text-muted-foreground">{delivery === 0 ? "Free delivery" : formatINR(49)}</div>
                  </button>
                  <button onClick={() => setDeliveryType("pickup")} className={`p-4 rounded-xl ring-1 text-left ${deliveryType === "pickup" ? "ring-accent bg-accent/5" : "ring-border"}`}>
                    <Store className="size-5 mb-2" />
                    <div className="font-medium">Store Pickup</div>
                    <div className="text-xs text-muted-foreground">Free · Ready in 2 hours</div>
                  </button>
                </div>
                <div className="mt-5 flex gap-3">
                  <button onClick={() => setStep("address")} className="flex-1 py-3 ring-1 ring-border rounded-xl font-medium">Back</button>
                  <button onClick={() => setStep("payment")} className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-medium">Continue</button>
                </div>
              </div>
            )}

            {step === "payment" && (
              <div className="bg-card ring-1 ring-border rounded-2xl p-6">
                <h3 className="font-medium">Payment Method</h3>
                <div className="mt-4 grid sm:grid-cols-2 gap-3">
                  {PAYMENT_METHODS.map((m) => (
                    <button key={m.id} onClick={() => setPaymentMethod(m.id)} className={`p-4 rounded-xl ring-1 text-left flex items-center gap-3 ${paymentMethod === m.id ? "ring-accent bg-accent/5" : "ring-border"}`}>
                      <m.icon className="size-5" />
                      <span className="font-medium">{m.label}</span>
                    </button>
                  ))}
                </div>
                {paymentMethod !== "cod" && (
                  <div className="mt-4 p-4 bg-muted rounded-xl text-sm space-y-3">
                    {paymentMethod === "upi" && <input placeholder="UPI ID (e.g. name@upi)" className="w-full bg-card rounded-lg px-3 py-2 ring-1 ring-border" />}
                    {(paymentMethod === "credit" || paymentMethod === "debit") && (
                      <>
                        <input placeholder="Card Number" className="w-full bg-card rounded-lg px-3 py-2 ring-1 ring-border" />
                        <div className="grid grid-cols-2 gap-3">
                          <input placeholder="MM/YY" className="bg-card rounded-lg px-3 py-2 ring-1 ring-border" />
                          <input placeholder="CVV" className="bg-card rounded-lg px-3 py-2 ring-1 ring-border" />
                        </div>
                      </>
                    )}
                    {paymentMethod === "netbanking" && (
                      <select className="w-full bg-card rounded-lg px-3 py-2 ring-1 ring-border">
                        <option>HDFC Bank</option><option>ICICI Bank</option><option>SBI</option><option>Axis Bank</option>
                      </select>
                    )}
                    {paymentMethod === "wallet" && (
                      <select className="w-full bg-card rounded-lg px-3 py-2 ring-1 ring-border">
                        <option>Paytm</option><option>PhonePe</option><option>Amazon Pay</option><option>MobiKwik</option>
                      </select>
                    )}
                  </div>
                )}
                <div className="mt-5 flex gap-3">
                  <button onClick={() => setStep("delivery")} className="flex-1 py-3 ring-1 ring-border rounded-xl font-medium">Back</button>
                  <button onClick={() => processPayment("success")} className="flex-1 py-3 bg-accent text-accent-foreground rounded-xl font-semibold">Pay {formatINR(total)}</button>
                </div>
                <button onClick={() => processPayment("failure")} className="mt-3 w-full py-2 text-xs text-muted-foreground hover:text-destructive">Simulate payment failure</button>
              </div>
            )}
          </div>

          <aside className="bg-card ring-1 ring-border rounded-2xl p-6 h-fit">
            <h3 className="font-medium">Order Summary</h3>
            <div className="mt-4 space-y-3 max-h-60 overflow-y-auto">
              {items.map((i) => (
                <div key={i.id} className="flex items-center gap-3 text-sm">
                  <img src={i.image} alt={i.name} className="size-10 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0 truncate">{i.name} × {i.qty}</div>
                  <div className="font-medium">{formatINR(i.price * i.qty)}</div>
                </div>
              ))}
            </div>
            <dl className="mt-5 pt-5 border-t space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatINR(subtotal)}</dd></div>
              {couponDiscount > 0 && <div className="flex justify-between text-savings"><dt>Coupon</dt><dd>− {formatINR(couponDiscount)}</dd></div>}
              <div className="flex justify-between"><dt className="text-muted-foreground">Delivery</dt><dd>{delivery === 0 ? "Free" : formatINR(delivery)}</dd></div>
              <div className="flex justify-between font-semibold text-base pt-2 border-t"><dt>Total</dt><dd>{formatINR(total)}</dd></div>
            </dl>
          </aside>
        </div>
      </section>
      <Footer />
    </div>
  );
}
