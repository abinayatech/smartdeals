import { createFileRoute, Link } from "@tanstack/react-router";
import { FloatingNav } from "@/components/layout/FloatingNav";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";
import { categories } from "@/lib/mock-data";

export const Route = createFileRoute("/categories")({
  head: () => ({ meta: [{ title: "Categories · Smart Deal" }, { name: "description", content: "Browse every shopping category powered by Smart Deal." }] }),
  component: CategoriesPage,
});

function CategoriesPage() {
  return (
    <div className="min-h-screen bg-background">
      <FloatingNav />
      <PageHeader eyebrow="Explore" title="Shop by category" subtitle="Curated by AI from your local stores and online retailers." />
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {categories.map((c) => (
            <Link key={c.id} to="/products" search={{ category: c.id } as never} className="bg-card ring-1 ring-border rounded-2xl p-6 hover:ring-accent/40 hover:-translate-y-0.5 transition-all">
              <div className="text-4xl">{c.emoji}</div>
              <div className="mt-4 font-medium text-lg">{c.name}</div>
              <div className="text-xs text-muted-foreground mt-1">{c.count.toLocaleString()} live deals</div>
            </Link>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}