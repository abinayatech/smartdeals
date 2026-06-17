import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Heart, ShoppingBag, TrendingDown, Wallet } from "lucide-react";
import { FloatingNav } from "@/components/layout/FloatingNav";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";
import { DealCard } from "@/components/deals/DealCard";
import { useAuth } from "@/lib/auth-context";
import { formatINR, products } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard · Smart Deal" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useAuth();
  const name = user?.fullName.split(" ")[0] ?? "there";

  return (
    <div className="min-h-screen bg-background">
      <FloatingNav />
      <PageHeader eyebrow="Dashboard" title={`Welcome back, ${name}`} subtitle="Your savings, orders and AI-curated recommendations." />
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="grid md:grid-cols-4 gap-4">
            <Stat icon={<Wallet className="size-4 text-savings" />} label="Money Saved" value={formatINR(18420)} />
            <Stat icon={<ShoppingBag className="size-4 text-accent" />} label="Orders" value="14" />
            <Stat icon={<Heart className="size-4 text-discount" />} label="Favorites" value="36" />
            <Stat icon={<Bell className="size-4 text-warning" />} label="Price Alerts" value="8" />
          </div>

          <div>
            <div className="flex items-end justify-between mb-6">
              <h3 className="text-xl font-medium">Recommended for you</h3>
              <Link to="/products" className="text-sm text-accent hover:underline">View all</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 4).map((p) => <DealCard key={p.id} product={p} />)}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-card ring-1 ring-border rounded-2xl p-6">
              <h3 className="font-medium">Recent activity</h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li className="flex items-center gap-3"><TrendingDown className="size-4 text-savings" /> Price drop on QuietComfort Ultra — saved ₹2,400</li>
                <li className="flex items-center gap-3"><ShoppingBag className="size-4 text-accent" /> Order #SD-19284 delivered from Blinkit</li>
                <li className="flex items-center gap-3"><Heart className="size-4 text-discount" /> Added Ninja Blender to favorites</li>
              </ul>
            </div>
            <div className="bg-primary text-primary-foreground rounded-2xl p-6">
              <h3 className="font-medium">This month's savings goal</h3>
              <div className="mt-2 text-3xl font-semibold">{formatINR(18420)} <span className="text-sm text-white/60">/ {formatINR(25000)}</span></div>
              <div className="mt-4 h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-accent" style={{ width: "73%" }} />
              </div>
              <p className="text-sm text-white/60 mt-4">You're 73% of the way there — 4 AI-recommended deals could push you over the line.</p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-card ring-1 ring-border rounded-2xl p-5">
      <div className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">{icon} {label}</div>
      <div className="mt-3 text-2xl font-semibold">{value}</div>
    </div>
  );
}