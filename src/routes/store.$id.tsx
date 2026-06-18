import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { MapPin, Star } from "lucide-react";
import { FloatingNav } from "@/components/layout/FloatingNav";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";
import { DealCard } from "@/components/deals/DealCard";
import { getDealsForStore, getProductsByStore, getReviewsForStore, getStoreById } from "@/lib/mock-data";
import { notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/store/$id")({
  head: ({ params }) => {
    const s = getStoreById(params.id);
    return { meta: [{ title: s ? `${s.name} · Smart Deal` : "Store · Smart Deal" }] };
  },
  loader: ({ params }) => {
    const s = getStoreById(params.id);
    if (!s) throw notFound();
    return {
      store: s,
      products: getProductsByStore(params.id).slice(0, 12),
      reviews: getReviewsForStore(params.id).slice(0, 5),
      deals: getDealsForStore(params.id).slice(0, 6),
    };
  },
  component: StorePage,
});

function StorePage() {
  const { store, products: storeProducts, reviews, deals } = Route.useLoaderData();
  const navigate = useNavigate();
  const display = storeProducts.length > 0 ? storeProducts : [];

  return (
    <div className="min-h-screen bg-background">
      <FloatingNav />
      <PageHeader
        eyebrow={store.category}
        title={store.name}
        subtitle={`${store.city} · ${store.distanceKm} km away · ${store.dealCount} live deals`}
        breadcrumbs={[{ label: "Stores", to: "/stores" }, { label: store.name }]}
        actions={
          <div className="flex items-center gap-2">
            <img src={store.logo} alt={store.name} className="size-10 rounded-lg" />
            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-card ring-1 ring-border rounded-full text-sm font-medium"><Star className="size-3.5 fill-warning text-warning" /> {store.rating} ({store.reviewCount})</span>
            <button onClick={() => navigate({ to: "/checkout", search: { pickup: store.id } })} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium">Reserve Pickup</button>
          </div>
        }
      />
      <section className="px-6 pb-24 space-y-12">
        <div className="max-w-6xl mx-auto bg-card ring-1 ring-border rounded-2xl p-6 grid md:grid-cols-4 gap-4 text-sm">
          <Info label="Average savings" value="18%" />
          <Info label="Delivery" value={store.delivery ? "Available" : "Pickup only"} />
          <Info label="Pickup" value={store.pickup ? "Available" : "Not available"} />
          <Info label="Location" value={<span className="inline-flex items-center gap-1"><MapPin className="size-3" /> {store.address}</span>} />
        </div>

        {deals.length > 0 && (
          <div className="max-w-6xl mx-auto">
            <h3 className="text-xl font-medium mb-6">Active deals</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {deals.map((d) => (
                <Link key={d.id} to="/product/$id" params={{ id: d.productId }} className="bg-card ring-1 ring-border rounded-2xl p-4 hover:ring-accent/40">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${d.type === "flash" ? "bg-discount text-white" : d.type === "best" ? "bg-savings text-white" : "bg-warning text-white"}`}>{d.type} deal</span>
                  <div className="font-medium mt-2 text-sm">{d.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{d.discount}% off · expires {new Date(d.expiresAt).toLocaleDateString("en-IN")}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="max-w-6xl mx-auto">
          <h3 className="text-xl font-medium mb-6">Products at {store.name}</h3>
          {display.length === 0 ? (
            <p className="text-muted-foreground">No products listed for this store right now.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {display.map((p) => <DealCard key={p.id} product={p} />)}
            </div>
          )}
        </div>

        {reviews.length > 0 && (
          <div className="max-w-6xl mx-auto">
            <h3 className="text-xl font-medium mb-6">Store reviews</h3>
            <div className="space-y-3">
              {reviews.map((r) => (
                <div key={r.id} className="bg-card ring-1 ring-border rounded-xl p-4">
                  <div className="flex justify-between">
                    <span className="font-medium text-sm">{r.userName}</span>
                    <span className="text-xs inline-flex items-center gap-0.5"><Star className="size-3 fill-warning text-warning" /> {r.rating}</span>
                  </div>
                  <p className="text-sm text-secondary mt-1">{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-medium mt-1">{value}</div>
    </div>
  );
}
