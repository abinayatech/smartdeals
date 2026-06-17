import { createFileRoute } from "@tanstack/react-router";
import savingsMap from "@/assets/savings-map.jpg";
import { FloatingNav } from "@/components/layout/FloatingNav";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";
import { stores } from "@/lib/mock-data";

export const Route = createFileRoute("/deal-map")({
  head: () => ({ meta: [{ title: "Deal Map · Smart Deal" }, { name: "description", content: "See every live deal in your neighborhood on the interactive Smart Deal map." }] }),
  component: DealMapPage,
});

function DealMapPage() {
  return (
    <div className="min-h-screen bg-background">
      <FloatingNav />
      <PageHeader eyebrow="Live" title="The Deal Map" subtitle="Heatmap of price drops, flash sales and clearance events near you." />
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_360px] gap-6">
          <div className="relative rounded-3xl overflow-hidden ring-1 ring-black/5 bg-primary aspect-[4/3] lg:aspect-auto lg:h-[640px]">
            <img src={savingsMap} alt="Deal map" className="w-full h-full object-cover opacity-90" />
            <div className="absolute top-6 left-6 flex gap-2">
              <span className="px-3 py-1.5 bg-card text-primary text-xs font-semibold rounded-full ring-1 ring-black/5">Heatmap</span>
              <span className="px-3 py-1.5 bg-card/80 backdrop-blur text-secondary text-xs font-medium rounded-full ring-1 ring-black/5">Pins</span>
            </div>
            <div className="absolute bottom-6 left-6 right-6 bg-card/95 backdrop-blur rounded-2xl p-4 ring-1 ring-black/5 flex flex-wrap items-center gap-3 text-xs">
              <Legend color="bg-savings" label="Best deal" />
              <Legend color="bg-warning" label="Limited stock" />
              <Legend color="bg-discount" label="Flash sale" />
              <div className="ml-auto text-muted-foreground">Showing {stores.length} live stores in Bandra & Khar</div>
            </div>
          </div>
          <aside className="space-y-3 max-h-[640px] overflow-y-auto pr-1 scrollbar-hide">
            {stores.map((s) => (
              <div key={s.id} className="bg-card ring-1 ring-border rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div className="font-medium truncate">{s.name}</div>
                  <span className="text-[10px] font-semibold text-accent">{s.distanceKm} km</span>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.dealCount} deals · {s.category}</div>
                <div className="mt-3 flex gap-2">
                  <button className="flex-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium">View Store</button>
                  <button className="px-3 py-1.5 ring-1 ring-border rounded-lg text-xs font-medium">Navigate</button>
                </div>
              </div>
            ))}
          </aside>
        </div>
      </section>
      <Footer />
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="inline-flex items-center gap-2">
      <span className={`size-2.5 rounded-full ${color}`} />
      <span className="font-medium text-secondary">{label}</span>
    </div>
  );
}