import { createFileRoute } from "@tanstack/react-router";
import { Bell, Brain, Map, Route as RouteIcon, ShieldCheck, Sparkles, TrendingDown, Wallet } from "lucide-react";
import { FloatingNav } from "@/components/layout/FloatingNav";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";

export const Route = createFileRoute("/features")({
  head: () => ({ meta: [{ title: "Features · Smart Deal" }] }),
  component: FeaturesPage,
});

const FEATURES = [
  { i: <Brain className="size-5 text-accent" />, t: "AI Price Prediction", d: "Forecast price drops 7–30 days out across categories." },
  { i: <Wallet className="size-5 text-savings" />, t: "AI Savings Analysis", d: "See exactly where your money goes — and where it shouldn't." },
  { i: <Sparkles className="size-5 text-warning" />, t: "AI Shopping Assistant", d: "Conversational search across stores in plain English." },
  { i: <RouteIcon className="size-5 text-accent" />, t: "Route Optimization", d: "The cheapest, fastest, or hybrid path through your shopping list." },
  { i: <Bell className="size-5 text-discount" />, t: "Price Alerts", d: "Get pinged the second a wishlisted product hits your target price." },
  { i: <Map className="size-5 text-primary" />, t: "Live Deal Map", d: "Heatmap of price drops and flash sales near you." },
  { i: <TrendingDown className="size-5 text-savings" />, t: "Combo Suggestions", d: "Bundle deals that unlock additional savings." },
  { i: <ShieldCheck className="size-5 text-primary" />, t: "Verified Deals", d: "AI cross-checks every community-submitted deal before you see it." },
];

function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      <FloatingNav />
      <PageHeader eyebrow="Features" title="Everything you need to shop smarter." subtitle="A complete intelligence layer wrapped in a delightful retail experience." />
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f) => (
            <div key={f.t} className="bg-card ring-1 ring-border rounded-2xl p-6 hover:ring-accent/40 transition-all">
              <div className="size-10 rounded-lg bg-muted grid place-items-center">{f.i}</div>
              <h3 className="mt-4 font-medium">{f.t}</h3>
              <p className="text-sm text-muted-foreground mt-1">{f.d}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}