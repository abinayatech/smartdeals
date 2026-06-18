import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Star } from "lucide-react";
import { FloatingNav } from "@/components/layout/FloatingNav";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";
import { stores } from "@/lib/mock-data";

export const Route = createFileRoute("/stores")({
  head: () => ({ meta: [{ title: "Stores · Smart Deal" }, { name: "description", content: "Find premium retail stores near you with live deals." }] }),
  component: StoresPage,
});

function StoresPage() {
  return (
    <div className="min-h-screen bg-background">
      <FloatingNav />
      <PageHeader eyebrow="Directory" title="Stores near you" subtitle={`${stores.length} stores with live deals across Mumbai`} breadcrumbs={[{ label: "Stores" }]} />
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {stores.map((s) => (
            <Link key={s.id} to="/store/$id" params={{ id: s.id }} className="group bg-card ring-1 ring-border rounded-2xl p-6 hover:ring-accent/40 transition-all">
              <div className="flex items-start gap-4">
                <img src={s.logo} alt={s.name} className="size-12 rounded-xl shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-[10px] font-bold text-accent uppercase tracking-wider">{s.category}</div>
                      <h3 className="font-medium text-lg mt-1 truncate">{s.name}</h3>
                      <div className="text-xs text-muted-foreground mt-1 inline-flex items-center gap-1">
                        <MapPin className="size-3" /> {s.city} · {s.distanceKm} km
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="inline-flex items-center gap-1 text-sm font-semibold"><Star className="size-3.5 fill-warning text-warning" /> {s.rating}</div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">{s.dealCount} deals</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-2 text-xs">
                {s.delivery && <span className="px-2 py-1 bg-savings/10 text-savings rounded font-medium">Delivery</span>}
                {s.pickup && <span className="px-2 py-1 bg-warning/10 text-warning rounded font-medium">Pickup</span>}
              </div>
            </Link>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}