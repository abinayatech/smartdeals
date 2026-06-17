import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { MapPin, Star } from "lucide-react";
import { FloatingNav } from "@/components/layout/FloatingNav";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";
import { DealCard } from "@/components/deals/DealCard";
import { products, stores } from "@/lib/mock-data";

export const Route = createFileRoute("/store/$id")({
  head: ({ params }) => {
    const s = stores.find((x) => x.id === params.id);
    return { meta: [{ title: s ? `${s.name} · Smart Deal` : "Store · Smart Deal" }] };
  },
  loader: ({ params }) => {
    const s = stores.find((x) => x.id === params.id);
    if (!s) throw notFound();
    return { store: s };
  },
  notFoundComponent: () => <NotFound />,
  errorComponent: () => <NotFound />,
  component: StorePage,
});

function StorePage() {
  const { store } = Route.useLoaderData();
  const storeProducts = products.filter((p) => p.storeId === store.id);
  const display = storeProducts.length > 0 ? storeProducts : products.slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <FloatingNav />
      <PageHeader
        eyebrow={store.category}
        title={store.name}
        subtitle={`${store.city} · ${store.distanceKm} km away · ${store.dealCount} live deals`}
        actions={
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-card ring-1 ring-border rounded-full text-sm font-medium"><Star className="size-3.5 fill-warning text-warning" /> {store.rating}</span>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium">Reserve Pickup</button>
          </div>
        }
      />
      <section className="px-6 pb-24 space-y-12">
        <div className="max-w-6xl mx-auto bg-card ring-1 ring-border rounded-2xl p-6 grid md:grid-cols-3 gap-4 text-sm">
          <Info label="Average savings" value="18%" />
          <Info label="Avg. delivery time" value={store.delivery ? "35 min" : "Pickup only"} />
          <Info label="Location" value={<span className="inline-flex items-center gap-1"><MapPin className="size-3" /> {store.city}, Mumbai</span>} />
        </div>
        <div className="max-w-6xl mx-auto">
          <h3 className="text-xl font-medium mb-6">Live deals at {store.name}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {display.map((p) => <DealCard key={p.id} product={p} />)}
          </div>
        </div>
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

function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <FloatingNav />
      <PageHeader eyebrow="Not found" title="Store not found" />
      <div className="px-6 pb-24 text-center">
        <Link to="/stores" className="inline-flex px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm">Browse stores</Link>
      </div>
      <Footer />
    </div>
  );
}