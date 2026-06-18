import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { EmptyState } from "@/components/common/EmptyState";
import { DealCard } from "@/components/deals/DealCard";
import { Button } from "@/components/ui/button";
import { categories, products } from "@/lib/mock-data";

type Search = { q?: string; category?: string; sort?: string; page?: number };

export const Route = createFileRoute("/products")({
  head: () => ({ meta: [{ title: "All Deals · Smart Deal" }, { name: "description", content: "Browse every live deal across stores near you." }] }),
  validateSearch: (s: Record<string, unknown>): Search => ({
    q: typeof s.q === "string" ? s.q : undefined,
    category: typeof s.category === "string" ? s.category : undefined,
    sort: typeof s.sort === "string" ? s.sort : "popular",
    page: typeof s.page === "number" ? s.page : typeof s.page === "string" ? parseInt(s.page) || 1 : 1,
  }),
  component: ProductsPage,
});

const SORTS = [
  { id: "popular", label: "Most Popular" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "discount", label: "Highest Discount" },
  { id: "near", label: "Nearest Store" },
  { id: "rating", label: "Top Rated" },
];

const PAGE_SIZE = 24;

function ProductsPage() {
  const search = Route.useSearch();
  const [query, setQuery] = useState(search.q ?? "");
  const [cat, setCat] = useState(search.category ?? "all");
  const [sortKey, setSortKey] = useState(search.sort ?? "popular");
  const [page, setPage] = useState(search.page ?? 1);

  const filtered = useMemo(() => {
    let list = [...products];
    if (query) list = list.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase()) || p.store.toLowerCase().includes(query.toLowerCase()));
    if (cat !== "all") list = list.filter((p) => p.categoryId === cat || p.category.toLowerCase() === categories.find((c) => c.id === cat)?.name.toLowerCase());
    list.sort((a, b) => {
      switch (sortKey) {
        case "price-asc": return a.price - b.price;
        case "price-desc": return b.price - a.price;
        case "discount": return (b.mrp - b.price) / b.mrp - (a.mrp - a.price) / a.mrp;
        case "near": return a.distanceKm - b.distanceKm;
        case "rating": return b.rating - a.rating;
        default: return b.dealScore - a.dealScore;
      }
    });
    return list;
  }, [query, cat, sortKey]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <AppShell
      header={{
        eyebrow: "All Deals",
        title: "Every live deal in your city",
        subtitle: `${filtered.length} results · updated live by AI`,
        breadcrumbs: [{ label: "Deals" }],
      }}
    >
      <div className="animate-slide-up">
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search products, brands…" className="flex-1 min-w-50 bg-card ring-1 ring-border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent shadow-card" />
          <select value={cat} onChange={(e) => { setCat(e.target.value); setPage(1); }} className="bg-card ring-1 ring-border rounded-xl px-3 py-2.5 text-sm shadow-card">
            <option value="all">All categories</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.count})</option>)}
          </select>
          <select value={sortKey} onChange={(e) => setSortKey(e.target.value)} className="bg-card ring-1 ring-border rounded-xl px-3 py-2.5 text-sm shadow-card">
            {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<Search className="size-10 text-muted-foreground" />}
            title="No deals match your filters"
            description="Try adjusting your search or category filter."
            actionLabel="Reset filters"
            onAction={() => { setQuery(""); setCat("all"); setPage(1); }}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {paged.map((p) => <DealCard key={p.id} product={p} />)}
            </div>
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
                <span className="text-sm text-muted-foreground px-2">Page {page} of {totalPages}</span>
                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
              </div>
            )}
          </>
        )}

        <div className="mt-12 text-center text-sm text-muted-foreground">
          Looking for stores instead? <Link to="/stores" className="text-accent font-medium hover:underline">Browse the store directory →</Link>
        </div>
      </div>
    </AppShell>
  );
}
