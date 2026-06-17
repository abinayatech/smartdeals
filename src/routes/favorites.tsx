import { createFileRoute, Link } from "@tanstack/react-router";
import { FloatingNav } from "@/components/layout/FloatingNav";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";
import { DealCard } from "@/components/deals/DealCard";
import { products, stores } from "@/lib/mock-data";

export const Route = createFileRoute("/favorites")({
  head: () => ({ meta: [{ title: "Favorites · Smart Deal" }] }),
  component: FavoritesPage,
});

function FavoritesPage() {
  return (
    <div className="min-h-screen bg-background">
      <FloatingNav />
      <PageHeader eyebrow="Saved" title="Your favorites" subtitle="Products, deals and stores you're tracking." />
      <section className="px-6 pb-24 space-y-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-secondary mb-4">Saved products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((p) => <DealCard key={p.id} product={p} />)}
          </div>
        </div>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-secondary mb-4">Saved stores</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {stores.slice(0, 3).map((s) => (
              <Link key={s.id} to="/store/$id" params={{ id: s.id }} className="bg-card ring-1 ring-border rounded-2xl p-5 hover:ring-accent/40">
                <div className="text-[10px] font-bold text-accent uppercase tracking-wider">{s.category}</div>
                <div className="font-medium mt-1">{s.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.dealCount} deals · {s.distanceKm} km</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}