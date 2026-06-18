import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { GitCompare, Heart, MapPin, Sparkles, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AppShell } from "@/components/layout/AppShell";
import { DealCard } from "@/components/deals/DealCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { FloatingNav } from "@/components/layout/FloatingNav";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useRequireAuth } from "@/lib/auth-context";
import { toggleCompare, getCompareList } from "@/lib/compare-service";
import { addProductToPlanner, predictPriceDrop } from "@/lib/planner-service";
import { discountPct, formatINR, getAlternatePrices, getProductById, getReviewsForProduct, stores } from "@/lib/mock-data";
import { useProductRecommendations } from "@/hooks/use-product-recommendations";
import { useCart, useFavorites } from "@/hooks/use-cart";
import { trackProductView } from "@/services/activity-service";
import { ProductReviews } from "@/components/product/ProductReviews";
import { ProductQA } from "@/components/product/ProductQA";
import { getPriceHistory } from "@/services/price-history-service";
export const Route = createFileRoute("/product/$id")({
  head: ({ params }) => {
    const p = getProductById(params.id);
    return { meta: [{ title: p ? `${p.name} · Smart Deal` : "Product · Smart Deal" }] };
  },
  loader: ({ params }) => {
    const p = getProductById(params.id);
    if (!p) throw notFound();
    return { product: p, reviews: getReviewsForProduct(params.id).slice(0, 5), altPrices: getAlternatePrices(params.id) };
  },
  notFoundComponent: () => <NotFound />,
  component: ProductPage,
});

function ProductPage() {
  const data = Route.useLoaderData();

if (!data) {
  return <div>Loading...</div>;
}

  const {
  product,
  reviews = [],
  altPrices = {},
} = data as {
  product: any;
  reviews: any[];
  altPrices: Record<string, number>;
};
  const guard = useRequireAuth();
  const navigate = useNavigate();
  const { add } = useCart();
  const { isFavorite, toggle } = useFavorites();
  const saved = isFavorite(product.id);
  const inCompare = getCompareList().includes(product.id);
  const [activeImage, setActiveImage] = useState(0);
  const pct = discountPct(product.price, product.mrp);
  const prediction = predictPriceDrop(product.name, product.price);
  const otherStores = stores.filter((s) => s.id !== product.storeId && altPrices[s.id]).slice(0, 5);
  const recommendations = useProductRecommendations(product, [], 4);
const priceHistory = getPriceHistory(product.id);
  const [priceRange, setPriceRange] = useState<"7" | "30" | "90">("30");

  useEffect(() => {
    try { trackProductView(product.id, product.categoryId); } catch { /* guest browsing */ }
  }, [product.id, product.categoryId]);

  const chartData = priceHistory
  ? priceRange === "7"
    ? priceHistory.points7
    : priceRange === "30"
    ? priceHistory.points30
    : priceHistory.points90
  : [];

  return (
    <AppShell
      header={{
        eyebrow: product.category,
        title: product.name,
        subtitle: `Sold by ${product.store} · ${product.distanceKm} km away`,
        breadcrumbs: [{ label: "Deals", to: "/products" }, { label: product.name }],
      }}
    >
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 animate-slide-up">
          <div>
            <div className="bg-card ring-1 ring-border rounded-3xl overflow-hidden aspect-square">
              <img src={product.images[activeImage] ?? product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="mt-3 flex gap-2">
            {product.images.map((img: string, i: number) => (
                <button key={i} onClick={() => setActiveImage(i)} className={`size-16 rounded-xl overflow-hidden ring-2 ${activeImage === i ? "ring-accent" : "ring-border"}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
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
            <p className="mt-4 text-sm text-secondary">{product.description}</p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button onClick={() => guard(() => { add(product, 1); navigate({ to: "/cart" }); })} className="h-12">Add to Cart</Button>
              <Button variant="default" className="h-12 bg-accent hover:bg-accent/90" onClick={() => guard(() => { add(product, 1); navigate({ to: "/checkout" }); })}>Buy Now</Button>
              <Button variant="outline" onClick={() => guard(() => { addProductToPlanner(product.id); navigate({ to: "/ai-planner" }); })}>Add to Planner</Button>
              <Button variant="outline" onClick={() => guard(() => toggle(product.id))} className="gap-2">
                <Heart className={`size-4 ${saved ? "fill-accent text-accent" : ""}`} /> {saved ? "Saved" : "Save Deal"}
              </Button>
              <Button variant="outline" onClick={() => { toggleCompare(product.id); navigate({ to: "/compare" }); }} className="gap-2 col-span-2">
                <GitCompare className="size-4" /> {inCompare ? "View comparison" : "Compare product"}
              </Button>
            </div>

            <div className="mt-8 bg-card ring-1 ring-border rounded-2xl p-5">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent">
                <Sparkles className="size-3.5" /> AI Price Prediction
              </div>
              <p className="mt-3 text-sm text-secondary">
                Predicted {prediction.drop}% drop to {formatINR(prediction.predicted)} in ~{prediction.days} days ({prediction.confidence}% confidence).
                {product.badge === "Lowest in 30 days" ? " Currently at lowest price in 30 days." : ""}
              </p>
            </div>

            {priceHistory !== null && chartData && (
              <div className="mt-6 bg-card ring-1 ring-border rounded-2xl p-5">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary">Price History</h3>
                  <div className="flex gap-1">
                    {(["7", "30", "90"] as const).map((r) => (
                      <button key={r} type="button" onClick={() => setPriceRange(r)} className={`px-2.5 py-1 text-xs rounded-lg ${priceRange === r ? "bg-primary text-primary-foreground" : "ring-1 ring-border"}`}>{r}d</button>
                    ))}
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={chartData}>
                    <XAxis dataKey="date" fontSize={10} tickFormatter={(v) => v.slice(5)} />
                    <YAxis fontSize={10} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} width={40} />
                    <Tooltip formatter={(v: number) => formatINR(v)} />
                    <Line type="monotone" dataKey="price" stroke="#EA580C" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 text-xs">
                  <div><span className="text-muted-foreground">Low</span><div className="font-semibold">{formatINR(priceHistory.lowest)}</div></div>
                  <div><span className="text-muted-foreground">High</span><div className="font-semibold">{formatINR(priceHistory.highest)}</div></div>
                  <div><span className="text-muted-foreground">Avg</span><div className="font-semibold">{formatINR(priceHistory.average)}</div></div>
                  <div><span className="text-muted-foreground">You save</span><div className="font-semibold text-savings">{formatINR(priceHistory.savings)}</div></div>
                </div>
              </div>
            )}

            <div className="mt-6">
              <div className="mt-3 space-y-2">
                {otherStores.map((s) => (
                  <Link key={s.id} to="/store/$id" params={{ id: s.id }} className="flex items-center justify-between p-4 bg-card ring-1 ring-border rounded-xl hover:ring-accent/40">
                    <div>
                      <div className="font-medium">{s.name}</div>
                      <div className="text-xs text-muted-foreground inline-flex items-center gap-1"><MapPin className="size-3" /> {s.distanceKm} km</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatINR(Math.round(altPrices[s.id]))}</div>
                      <div className="text-[10px] text-muted-foreground uppercase">in stock</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {reviews.length > 0 && (
  <div className="mt-8 lg:hidden">
    <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary mb-3">
      Featured reviews
    </h3>

    <div className="space-y-3">
      {reviews.slice(0, 2).map((r: any) => (
        <div key={r.id} className="bg-card ring-1 ring-border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-sm">{r.userName}</span>
            <span className="text-xs inline-flex items-center gap-0.5">
              <Star className="size-3 fill-warning text-warning" />
              {r.rating}
            </span>
          </div>
          <p className="text-sm text-secondary mt-1">{r.text}</p>
        </div>
      ))}
    </div>
  </div>
)}

                
          </div>
        </div>

        <ProductReviews productId={product.id} />
        <ProductQA productId={product.id} />

        {recommendations.length > 0 && (
          <section className="mt-12 lg:mt-16">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-secondary mb-4">You may also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendations.map((p) => <DealCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
    </AppShell>
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
