import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect, useMemo, useState } from "react";
import type { Deal, Store } from "@/models";
import { formatINR } from "@/lib/mock-data";
import { Link } from "@tanstack/react-router";
import "leaflet/dist/leaflet.css";

const MUMBAI_CENTER: [number, number] = [19.076, 72.8777];

const storeIcon = new L.DivIcon({
  className: "",
  html: `<div style="width:12px;height:12px;border-radius:50%;background:#1e3a5f;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.3)"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

const dealIcon = (color: string) =>
  new L.DivIcon({
    className: "",
    html: `<div style="width:10px;height:10px;border-radius:50%;background:${color};border:2px solid white"></div>`,
    iconSize: [10, 10],
    iconAnchor: [5, 5],
  });

function FlyTo({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 14, { duration: 0.8 });
  }, [lat, lng, map]);
  return null;
}

type DealMapLeafletProps = {
  stores: Store[];
  deals: Deal[];
  categoryFilter: string;
  search: string;
  selectedStoreId?: string;
  onSelectStore: (id: string) => void;
};

export function DealMapLeaflet({ stores, deals, categoryFilter, search, selectedStoreId, onSelectStore }: DealMapLeafletProps) {
  const [fly, setFly] = useState<{ lat: number; lng: number } | null>(null);

  const filteredStores = useMemo(() => {
    let list = stores;
    if (categoryFilter !== "all") list = list.filter((s) => s.category.toLowerCase().includes(categoryFilter.toLowerCase()));
    if (search) list = list.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.city.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [stores, categoryFilter, search]);

  const filteredDeals = useMemo(() => {
    const storeIds = new Set(filteredStores.map((s) => s.id));
    return deals.filter((d) => storeIds.has(d.storeId)).slice(0, 200);
  }, [deals, filteredStores]);

  const dealColor = (type: Deal["type"]) => (type === "flash" ? "#EA580C" : type === "limited" ? "#7B2D8E" : "#16A34A");

  return (
    <div className="relative h-[min(70vh,560px)] rounded-2xl overflow-hidden ring-1 ring-border shadow-card">
      <MapContainer center={MUMBAI_CENTER} zoom={12} className="h-full w-full" scrollWheelZoom>
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {fly && <FlyTo lat={fly.lat} lng={fly.lng} />}
        {filteredStores.map((s) => (
          <Marker
            key={s.id}
            position={[s.lat, s.lng]}
            icon={storeIcon}
            eventHandlers={{ click: () => onSelectStore(s.id) }}
          >
            <Popup>
              <div className="text-sm space-y-1 min-w-40">
                <div className="font-semibold">{s.name}</div>
                <div className="text-xs text-muted-foreground">{s.city} · {s.distanceKm} km</div>
                <div className="text-xs">{s.dealCount} deals · ⭐ {s.rating}</div>
                <Link to="/store/$id" params={{ id: s.id }} className="text-xs text-accent font-medium">View store →</Link>
                <button type="button" className="block text-xs text-primary mt-1" onClick={() => setFly({ lat: s.lat, lng: s.lng })}>
                  Center map
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
        {filteredDeals.map((d) => {
          const store = stores.find((s) => s.id === d.storeId);
          return (
            <Marker key={d.id} position={[d.lat, d.lng]} icon={dealIcon(dealColor(d.type))}>
              <Popup>
                <div className="text-sm">
                  <div className="font-medium">{d.title}</div>
                  <div className="text-xs text-muted-foreground">{d.discount}% off · {d.stockRemaining} left</div>
                  {store && <div className="text-xs">{store.name}</div>}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      {selectedStoreId && (() => {
        const s = stores.find((x) => x.id === selectedStoreId);
        if (!s) return null;
        return (
          <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-card/95 backdrop-blur p-4 rounded-xl ring-1 ring-border shadow-lg animate-slide-up">
            <div className="font-semibold">{s.name}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.address}</div>
            <div className="flex gap-2 mt-3">
              <Link to="/store/$id" params={{ id: s.id }} className="flex-1 text-center py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium">View Store</Link>
              <button type="button" onClick={() => setFly({ lat: s.lat, lng: s.lng })} className="flex-1 py-2 ring-1 ring-border rounded-lg text-xs">Directions (sim)</button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 10) / 10;
}
