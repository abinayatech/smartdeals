import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, MapPin, Sparkles, TrendingUp, Wallet } from "lucide-react";
import { useState } from "react";
import savingsMap from "@/assets/savings-map.jpg";
import { FloatingNav } from "@/components/layout/FloatingNav";
import { Footer } from "@/components/layout/Footer";
import { DealCard } from "@/components/deals/DealCard";
import { categories, products, stores } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Smart Deal — Discover the Smartest Way to Shop" },
      { name: "description", content: "Compare prices, discover nearby discounts and maximize savings with AI across India's top retailers." },
      { property: "og:title", content: "Smart Deal — AI-Powered Retail Intelligence" },
      { property: "og:description", content: "Compare prices, discover nearby discounts and maximize savings with AI." },
    ],
  }),
  component: HomePage,
});

const MODES = ["Delivery", "Pickup", "In-store"] as const;

function HomePage() {
  const [mode, setMode] = useState<(typeof MODES)[number]>("Delivery");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <FloatingNav />

      {/* Hero */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center text-center gap-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/5 ring-1 ring-accent/20 rounded-full text-xs font-medium text-accent uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
              </span>
              AI Shopping Mode Active
            </div>

            <h1 className="text-4xl md:text-6xl font-medium tracking-tight text-primary leading-tight text-balance max-w-[24ch]">
              Discover the smartest way to shop.
            </h1>
            <p className="text-lg text-muted-foreground max-w-[52ch] text-pretty -mt-2">
              Compare prices across stores, find nearby discounts, and let AI plan your shopping for maximum savings.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const q = (new FormData(e.currentTarget).get("q") as string) || "";
                window.location.href = `/products?q=${encodeURIComponent(q)}`;
              }}
              className="w-full max-w-2xl bg-card ring-1 ring-black/5 shadow-sm rounded-2xl p-2 flex flex-col md:flex-row items-center gap-2"
            >
              <div className="flex-1 w-full">
                <input
                  name="q"
                  type="text"
                  placeholder="Ask Smart Deal AI... 'Find the cheapest Dyson V12 near Bandra'"
                  className="w-full bg-transparent border-none py-3 px-4 text-base outline-none placeholder:text-muted-foreground/70"
                />
              </div>
              <div className="flex items-center gap-1 p-1 bg-muted rounded-xl">
                {MODES.map((m) => (
                  <button
                    type="button"
                    key={m}
                    onClick={() => setMode(m)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                      mode === m ? "bg-card text-primary shadow-sm ring-1 ring-black/5" : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <button className="w-full md:w-auto px-6 py-3 bg-accent text-accent-foreground font-medium rounded-xl hover:opacity-90 transition-opacity">
                Search
              </button>
            </form>

            <div className="flex flex-wrap justify-center gap-2">
              {categories.slice(0, 8).map((c) => (
                <Link
                  key={c.id}
                  to="/products"
                  search={{ category: c.id } as never}
                  className="px-4 py-1.5 bg-card ring-1 ring-border rounded-full text-xs font-medium text-secondary hover:ring-accent/40 transition-all"
                >
                  {c.emoji} {c.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Link to="/products" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90">
                Explore Deals
              </Link>
              <Link to="/stores" className="inline-flex items-center gap-2 px-5 py-2.5 ring-1 ring-border bg-card text-primary rounded-xl text-sm font-medium hover:ring-accent/40">
                Browse Stores
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AI Recommendations */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-accent font-medium text-sm tracking-wide uppercase">
                <Sparkles className="size-4" /> Intelligence
              </div>
              <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-balance leading-tight">
                Your AI Savings Planner
              </h2>
              <p className="text-lg text-white/70 text-pretty max-w-[48ch]">
                We analyzed your cart across 12 stores. By splitting your order, you can save ₹2,450 this weekend.
              </p>
              <div className="space-y-4">
                <InsightRow
                  icon={<Wallet className="size-5 text-savings" />}
                  iconBg="bg-savings/20"
                  title="₹1,200 saved on Electronics"
                  desc="Reliance Digital has a flash discount on the headphones in your wishlist."
                />
                <InsightRow
                  icon={<MapPin className="size-5 text-accent" />}
                  iconBg="bg-accent/20"
                  title="Nearby Price Drop"
                  desc="Blinkit just dropped milk prices by 15% for your local pin code."
                />
                <InsightRow
                  icon={<TrendingUp className="size-5 text-warning" />}
                  iconBg="bg-warning/20"
                  title="Predicted weekend sale"
                  desc="AI expects Croma to discount your wishlisted speakers by ~12% on Saturday."
                />
              </div>
              <Link to="/ai-planner" className="inline-flex items-center gap-2 mt-2 px-5 py-2.5 bg-accent text-accent-foreground rounded-xl text-sm font-semibold hover:opacity-90">
                Open AI Planner
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-square bg-white/5 ring-1 ring-white/10 rounded-3xl overflow-hidden">
                <img src={savingsMap} alt="Smart Deal savings map preview" loading="lazy" width={1024} height={1024} className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-accent p-6 rounded-2xl shadow-xl text-white">
                <div className="text-3xl font-semibold mb-1">₹8,420</div>
                <div className="text-xs font-medium uppercase tracking-wider text-white/80">Monthly potential savings</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Deals */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12 gap-6 flex-wrap">
            <div>
              <h3 className="text-2xl md:text-3xl font-medium tracking-tight text-primary">Trending Deals</h3>
              <p className="text-muted-foreground text-pretty max-w-[44ch] mt-2">AI-verified price drops across Mumbai and Delhi.</p>
            </div>
            <div className="flex gap-2">
              <button className="size-10 rounded-full border border-border bg-card flex items-center justify-center hover:bg-muted transition-colors">
                <ChevronLeft className="size-4" />
              </button>
              <button className="size-10 rounded-full border border-border bg-card flex items-center justify-center hover:bg-muted transition-colors">
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((p) => (
              <DealCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Nearby Deals */}
      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-8">
            <h3 className="text-2xl md:text-3xl font-medium tracking-tight text-primary">Nearby Deals</h3>
            <p className="text-muted-foreground mt-2">Within 3 km of your location · live availability</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stores.slice(0, 6).map((s) => (
              <Link
                key={s.id}
                to="/store/$id"
                params={{ id: s.id }}
                className="group bg-card ring-1 ring-black/5 rounded-2xl p-5 hover:ring-accent/30 transition-all flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <div className="text-[10px] font-bold text-accent uppercase tracking-wider">{s.category}</div>
                  <div className="font-medium mt-1 truncate">{s.name}</div>
                  <div className="text-xs text-muted-foreground mt-1 truncate">{s.dealCount} live deals · {s.city}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-semibold">{s.distanceKm} km</div>
                  <div className="text-[10px] text-savings font-medium uppercase">★ {s.rating}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Category Explorer */}
      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-8 flex items-end justify-between gap-6 flex-wrap">
            <div>
              <h3 className="text-2xl md:text-3xl font-medium tracking-tight text-primary">Browse Categories</h3>
              <p className="text-muted-foreground mt-2">Curated by AI from your local stores.</p>
            </div>
            <Link to="/categories" className="text-sm font-medium text-accent hover:underline">View all →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((c) => (
              <Link
                key={c.id}
                to="/products"
                search={{ category: c.id } as never}
                className="group bg-card ring-1 ring-border rounded-2xl p-6 hover:ring-accent/40 hover:-translate-y-0.5 transition-all"
              >
                <div className="text-3xl">{c.emoji}</div>
                <div className="mt-3 font-medium">{c.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{c.count.toLocaleString()} live deals</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Deal Map Preview */}
      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="relative rounded-3xl overflow-hidden ring-1 ring-black/5 bg-primary">
            <img src={savingsMap} alt="Deal map preview" loading="lazy" width={1024} height={1024} className="w-full h-[360px] object-cover opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/40 to-transparent" />
            <div className="absolute inset-0 flex items-center px-8 md:px-12">
              <div className="max-w-md text-white">
                <div className="text-xs uppercase tracking-widest text-accent font-semibold mb-3">Deal Map</div>
                <h3 className="text-2xl md:text-3xl font-medium tracking-tight mb-3">See every discount in your neighborhood.</h3>
                <p className="text-white/70 mb-6">Live heatmap of price drops, flash sales and clearance events near you.</p>
                <Link to="/deal-map" className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-accent-foreground rounded-xl text-sm font-semibold">
                  Open Deal Map
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-card ring-1 ring-black/5 rounded-3xl p-10 md:p-14 text-center">
            <h3 className="text-3xl md:text-4xl font-medium tracking-tight text-balance max-w-[28ch] mx-auto">Start saving smarter, today.</h3>
            <p className="text-muted-foreground mt-3 max-w-[48ch] mx-auto">Create a free Smart Deal account to unlock the AI Planner, save deals, and track price drops.</p>
            <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
              <Link to="/auth" className="px-6 py-3 bg-accent text-accent-foreground rounded-xl text-sm font-semibold">Get Started Free</Link>
              <Link to="/pricing" className="px-6 py-3 ring-1 ring-border bg-card rounded-xl text-sm font-medium">View Pricing</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function InsightRow({ icon, iconBg, title, desc }: { icon: React.ReactNode; iconBg: string; title: string; desc: string }) {
  return (
    <div className="p-4 bg-white/5 ring-1 ring-white/10 rounded-xl flex items-start gap-4">
      <div className={`size-10 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>{icon}</div>
      <div>
        <p className="font-medium mb-1">{title}</p>
        <p className="text-sm text-white/50">{desc}</p>
      </div>
    </div>
  );
}
