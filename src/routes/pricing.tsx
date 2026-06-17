import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { FloatingNav } from "@/components/layout/FloatingNav";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";

export const Route = createFileRoute("/pricing")({
  head: () => ({ meta: [{ title: "Pricing · Smart Deal" }] }),
  component: PricingPage,
});

const TIERS = [
  { name: "Free", price: "₹0", cadence: "forever", featured: false, features: ["Browse deals", "Save up to 10 products", "Basic price alerts", "Deal map preview"] },
  { name: "Plus", price: "₹99", cadence: "/ month", featured: true, features: ["Unlimited favorites", "AI Planner", "Predicted price drops", "Hybrid shopping routes", "Community deal feed"] },
  { name: "Family", price: "₹249", cadence: "/ month", featured: false, features: ["Everything in Plus", "5 family members", "Shared cart & planner", "Household savings reports"] },
];

function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <FloatingNav />
      <PageHeader eyebrow="Pricing" title="Pricing that pays for itself." subtitle="Most members save back the Plus tier in the first weekend." />
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {TIERS.map((t) => (
            <div key={t.name} className={`rounded-3xl p-8 ${t.featured ? "bg-primary text-primary-foreground" : "bg-card ring-1 ring-border"}`}>
              <div className={`text-xs font-semibold uppercase tracking-wider ${t.featured ? "text-accent" : "text-muted-foreground"}`}>{t.name}</div>
              <div className="mt-4 flex items-baseline gap-1">
                <div className="text-4xl font-semibold">{t.price}</div>
                <div className={`text-sm ${t.featured ? "text-white/60" : "text-muted-foreground"}`}>{t.cadence}</div>
              </div>
              <ul className="mt-6 space-y-3 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className={`size-4 mt-0.5 shrink-0 ${t.featured ? "text-accent" : "text-savings"}`} /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/auth" className={`mt-8 inline-flex w-full justify-center py-3 rounded-xl text-sm font-semibold ${t.featured ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"}`}>
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}