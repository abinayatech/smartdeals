import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ClientOnly } from "@/components/common/ClientOnly";
import { DealMapLeaflet, haversineKm } from "@/components/map/DealMapLeaflet";
import { categories, deals, stores } from "@/lib/mock-data";
import { Link, useNavigate } from "@tanstack/react-router";
import { LoadingGrid } from "@/components/common/LoadingGrid";

export const Route = createFileRoute("/deal-map")({
  head: () => ({ meta: [{ title: "Deal Map · Smart Deal" }, { name: "description", content: "OpenStreetMap powered deal discovery with store markers and filters." }] }),
  component: DealMapPage,
});

const USER_LAT = 19.076;
const USER_LNG = 72.8777;

function DealMapPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedStoreId, setSelectedStoreId] = useState<string | undefined>();

  const nearbyStores = useMemo(() => {
    return [...stores]
      .map((s) => ({ ...s, dist: haversineKm(USER_LAT, USER_LNG, s.lat, s.lng) }))
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 20);
  }, []);

  return (
    <AppShell
      header={{
        eyebrow: "OpenStreetMap",
        title: "The Deal Map",
        subtitle: `${stores.length} stores · ${deals.length} live deals · pan, zoom & filter`,
        breadcrumbs: [{ label: "Deal Map" }],
      }}
      wide
    >
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_320px] gap-6 animate-slide-up">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search stores or areas…"
              className="flex-1 min-w-[180px] bg-card ring-1 ring-border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent"
            />
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="bg-card ring-1 ring-border rounded-xl px-3 py-2.5 text-sm">
              <option value="all">All categories</option>
              {[...new Set(stores.map((s) => s.category))].slice(0, 20).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <ClientOnly fallback={<div className="h-[560px] rounded-2xl ring-1 ring-border p-6"><LoadingGrid count={4} /></div>}>
            <DealMapLeaflet
              stores={stores}
              deals={deals}
              categoryFilter={categoryFilter}
              search={search}
              selectedStoreId={selectedStoreId}
              onSelectStore={setSelectedStoreId}
            />
          </ClientOnly>
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground px-1">
            <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-primary" /> Store</span>
            <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-savings" /> Best deal</span>
            <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-discount" /> Flash</span>
            <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-warning" /> Limited</span>
          </div>
        </div>
        <aside className="space-y-3 max-h-[640px] overflow-y-auto">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary">Nearby stores</h3>
          {nearbyStores.map((s) => (
            <div key={s.id} className="bg-card ring-1 ring-border rounded-2xl p-4 shadow-card">
              <div className="flex items-center gap-3">
                <img src={s.logo} alt={s.name} className="size-10 rounded-lg" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{s.name}</div>
                  <div className="text-xs text-muted-foreground">{s.dealCount} deals · {s.dist} km</div>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button type="button" onClick={() => navigate({ to: "/store/$id", params: { id: s.id } })} className="flex-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium">View</button>
                <button type="button" onClick={() => setSelectedStoreId(s.id)} className="px-3 py-1.5 ring-1 ring-border rounded-lg text-xs font-medium">Map</button>
              </div>
            </div>
          ))}
          <Link to="/stores" className="block text-center text-sm text-accent font-medium py-2">Browse all stores →</Link>
        </aside>
      </div>
    </AppShell>
  );
}
