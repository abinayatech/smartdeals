import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { EmptyState } from "@/components/common/EmptyState";
import { DealCard } from "@/components/deals/DealCard";
import { useFavorites } from "@/hooks/use-cart";
import { getProductById, stores } from "@/lib/mock-data";
import { requireAuth } from "@/lib/route-guard";

export const Route = createFileRoute("/favorites")({
  head: () => ({ meta: [{ title: "Favorites · Smart Deal" }] }),
  beforeLoad: () => requireAuth("/favorites"),
  component: FavoritesPage,
});

function FavoritesPage() {
  const { ids } = useFavorites();
  const favProducts = ids.map((id) => getProductById(id)).filter(Boolean);

  return (
    <AppShell
      header={{
        eyebrow: "Saved",
        title: "Your favorites",
        subtitle: `${favProducts.length} saved products`,
        breadcrumbs: [{ label: "Favorites" }],
      }}
    >
      <div className="space-y-12 animate-slide-up">
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-secondary mb-4">Saved products</h2>
          {favProducts.length === 0 ? (
            <EmptyState
              icon={<Heart className="size-10 text-muted-foreground" />}
              title="No favorites yet"
              description="Tap the heart on any deal to save it for later."
              actionLabel="Browse deals"
              actionTo="/products"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {favProducts.map((p) => p && <DealCard key={p.id} product={p} />)}
            </div>
          )}
        </section>
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-secondary mb-4">Popular stores</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {stores.slice(0, 6).map((s) => (
              <Link key={s.id} to="/store/$id" params={{ id: s.id }} className="bg-card ring-1 ring-border rounded-2xl p-5 hover:ring-accent/40 flex items-center gap-3 shadow-card transition-all">
                <img src={s.logo} alt={s.name} className="size-10 rounded-lg" />
                <div>
                  <div className="font-medium">{s.name}</div>
                  <div className="text-xs text-muted-foreground">{s.dealCount} deals · {s.distanceKm} km</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
