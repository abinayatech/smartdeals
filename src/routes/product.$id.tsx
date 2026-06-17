import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Heart, MapPin, Sparkles, Star } from "lucide-react";
import { FloatingNav } from "@/components/layout/FloatingNav";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";
import { useRequireAuth } from "@/lib/auth-context";
import { discountPct, formatINR, products, stores } from "@/lib/mock-data";

export const Route = createFileRoute("/product/$id")({
  head: ({ params }) => {
    const p = products.find((x) => x.id === params.id);
    return { meta: [{ title: p ? `${p.name} · Smart Deal` : "Product · Smart Deal" }] };
  },
  loader: ({ params }) => {
    const p = products.find((x) => x.id === params.id);
    if (!p) throw notFound();
    return { product: p };
  },
  notFoundComponent: () => <NotFound />,
  errorComponent: () => <NotFound />,
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const guard = useRequireAuth();
  const pct = discountPct(product.price, product.mrp);
  const otherStores = stores.filter((s) => s.id !== product.storeId).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <FloatingNav />
      <PageHeader eyebrow={product.category} title={product.name} subtitle={`Sold by ${product.store} · ${product.distanceKm} km away`} />
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10">
          <div className="bg-card ring-1 ring-border rounded-3xl overflow-hidden aspect-square">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="inline-flex items-center gap-2">
              <span className="px-2 py-1 bg-discount text-white text-[10px] font-semibold rounded uppercase">{pct}% OFF</span>
              <span className="text-xs inline-flex items-center gap-1 text-secondary"><Star className="size-3 fill-warning text-warning" /> {product.rating} · {product.reviews.toLocaleString()} reviews</span>
            </div>
            <div className="mt-4 flex items-baseline gap-3">
              <div className="text-4xl font-semibold">{formatINR(product.price)}</div>
              <div className="text-muted-foreground line-through">{formatINR(product.mrp)}</div>
            </div>
            <div className="mt-1 text-sm text-savings font-medium">You save {formatINR(product.mrp - product.price)}</div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button onClick={() => guard(() => (window.location.href = "/cart"))} className="py-3 bg-primary text-primary-foreground rounded-xl font-semibold">Add to Cart</button>
              <button onClick={() => guard(() => (window.location.href = "/cart"))} className="py-3 bg-accent text-accent-foreground rounded-xl font-semibold">Buy Now</button>
              <button onClick={() => guard(() => (window.location.href = "/ai-planner"))} className="py-3 ring-1 ring-border rounded-xl font-medium">Add to Planner</button>
              <button onClick={() => guard(() => (window.location.href = "/favorites"))} className="py-3 ring-1 ring-border rounded-xl font-medium inline-flex items-center justify-center gap-2"><Heart className="size-4" /> Save Deal</button>
            </div>

            <div className="mt-8 bg-card ring-1 ring-border rounded-2xl p-5">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent">
                <Sparkles className="size-3.5" /> AI Insights
              </div>
              <p className="mt-3 text-sm text-secondary">
                Lowest price in 30 days. Our model predicts a further 4% drop in the next 14 days — but stock at {product.store} is limited.
              </p>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary">Also available at</h3>
              <div className="mt-3 space-y-2">
                {otherStores.map((s) => (
                  <Link key={s.id} to="/store/$id" params={{ id: s.id }} className="flex items-center justify-between p-4 bg-card ring-1 ring-border rounded-xl hover:ring-accent/40">
                    <div>
                      <div className="font-medium">{s.name}</div>
                      <div className="text-xs text-muted-foreground inline-flex items-center gap-1"><MapPin className="size-3" /> {s.distanceKm} km</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatINR(product.price + Math.round(Math.random() * 800))}</div>
                      <div className="text-[10px] text-muted-foreground uppercase">in stock</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <FloatingNav />
      <PageHeader eyebrow="Not found" title="Product not found" subtitle="That deal may have ended." />
      <div className="px-6 pb-24 text-center">
        <Link to="/products" className="inline-flex px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm">Browse all deals</Link>
      </div>
      <Footer />
    </div>
  );
}