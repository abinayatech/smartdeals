import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { FloatingNav } from "@/components/layout/FloatingNav";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";
import { DealCard } from "@/components/deals/DealCard";
import { categories, products } from "@/lib/mock-data";

type Search = { q?: string; category?: string; sort?: string };

export const Route = createFileRoute("/products")({
  head: () => ({ meta: [{ title: "All Deals · Smart Deal" }, { name: "description", content: "Browse every live deal across stores near you." }] }),
  validateSearch: (s: Record<string, unknown>): Search => ({
    q: typeof s.q === "string" ? s.q : undefined,
    category: typeof s.category === "string" ? s.category : undefined,
    sort: typeof s.sort === "string" ? s.sort : "popular",
  }),
  component: ProductsPage,
});

const SORTS = [
  { id: "popular", label: "Most Popular" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "discount", label: "Highest Discount" },
  { id: "near", label: "Nearest Store" },
];

function ProductsPage() {
  const { q, category, sort } = Route.useSearch();
  const [query, setQuery] = useState(q ?? "");
  const [cat, setCat] = useState(category ?? "all");
  const [sortKey, setSortKey] = useState(sort ?? "popular");

  const filtered = useMemo(() => {
    let list = [...products];
    if (query) list = list.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
    if (cat !== "all") list = list.filter((p) => p.category.toLowerCase() === categories.find((c) => c.id === cat)?.name.toLowerCase());
    list.sort((a, b) => {
      switch (sortKey) {
        case "price-asc": return a.price - b.price;
        case "price-desc": return b.price - a.price;
        case "discount": return (b.mrp - b.price) / b.mrp - (a.mrp - a.price) / a.mrp;
        case "near": return a.distanceKm - b.distanceKm;
        default: return b.dealScore - a.dealScore;
      }
    });
    return list;
  }, [query, cat, sortKey]);

  return (
    <div className="min-h-screen bg-background">
      <FloatingNav />
      <PageHeader eyebrow="All Deals" title="Every live deal in your city" subtitle={`${filtered.length} results · updated live by AI`} />
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, brands…"
              className="flex-1 min-w-[200px] bg-card ring-1 ring-border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-accent focus:ring-2"
            />
            <select value={cat} onChange={(e) => setCat(e.target.value)} className="bg-card ring-1 ring-border rounded-xl px-3 py-2.5 text-sm">
              <option value="all">All categories</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select value={sortKey} onChange={(e) => setSortKey(e.target.value)} className="bg-card ring-1 ring-border rounded-xl px-3 py-2.5 text-sm">
              {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20 bg-card ring-1 ring-border rounded-2xl">
              <div className="text-4xl">🔍</div>
              <h3 className="mt-3 font-medium">No deals match your filters</h3>
              <p className="text-sm text-muted-foreground mt-1">Try a different search or category.</p>
              <button onClick={() => { setQuery(""); setCat("all"); }} className="mt-5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm">Reset filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filtered.map((p) => <DealCard key={p.id} product={p} />)}
            </div>
          )}

          <div className="mt-12 text-center text-sm text-muted-foreground">
            Looking for stores instead? <Link to="/stores" className="text-accent font-medium hover:underline">Browse the store directory →</Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}