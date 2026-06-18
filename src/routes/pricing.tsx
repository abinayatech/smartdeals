import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { FloatingNav } from "@/components/layout/FloatingNav";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";
import { useAuth } from "@/lib/auth-context";
import { setSubscription } from "@/lib/settings-service";

export const Route = createFileRoute("/pricing")({
  head: () => ({ meta: [{ title: "Pricing · Smart Deal" }] }),
  component: PricingPage,
});

const TIERS = [
  { id: "free", name: "Free Plan", monthly: 0, yearly: 0, featured: false, features: ["Browse all deals", "Save up to 10 products", "Basic price alerts", "Deal map preview", "Community access"] },
  { id: "plus", name: "Smart Plus", monthly: 99, yearly: 999, featured: false, features: ["Unlimited favorites", "AI Planner", "Predicted price drops", "Hybrid shopping routes", "Priority notifications"] },
  { id: "pro", name: "Smart Pro", monthly: 249, yearly: 2490, featured: true, features: ["Everything in Smart Plus", "Advanced AI insights", "Budget planning tools", "Savings forecast", "Early flash sale access", "Dedicated support"] },
  { id: "enterprise", name: "Enterprise", monthly: 999, yearly: 9990, featured: false, features: ["Everything in Smart Pro", "Team accounts (up to 50)", "Custom analytics", "API access", "White-label options", "SLA guarantee"] },
];

const FAQ = [
  { q: "Can I switch plans anytime?", a: "Yes. Upgrades take effect immediately. Downgrades apply at the end of your billing cycle." },
  { q: "Is there a free trial?", a: "Smart Plus and Smart Pro come with a 14-day free trial. No credit card required." },
  { q: "How does yearly billing work?", a: "Pay annually and save ~17% compared to monthly billing. Billed once per year." },
  { q: "What payment methods do you accept?", a: "UPI, credit/debit cards, net banking, and wallets. All payments are simulated in demo mode." },
];

const COMPARE = ["Browse deals", "AI Planner", "Price predictions", "Unlimited favorites", "Budget planning", "Team accounts", "API access"];

function PricingPage() {
  const [yearly, setYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { isAuthenticated } = useAuth();

  const handleUpgrade = (tierId: string) => {
    setSubscription(tierId as "free" | "plus" | "pro" | "enterprise");
    window.location.href = isAuthenticated ? "/dashboard" : "/auth?next=/dashboard";
  };

  return (
    <div className="min-h-screen bg-background">
      <FloatingNav />
      <PageHeader eyebrow="Pricing" title="Pricing that pays for itself." subtitle="Most members save back Smart Plus in the first weekend." breadcrumbs={[{ label: "Pricing" }]} />
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-10">
            <span className={`text-sm font-medium ${!yearly ? "text-primary" : "text-muted-foreground"}`}>Monthly</span>
            <button onClick={() => setYearly(!yearly)} className={`relative w-12 h-6 rounded-full transition-colors ${yearly ? "bg-accent" : "bg-muted"}`}>
              <span className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-transform ${yearly ? "translate-x-6" : "translate-x-0.5"}`} />
            </button>
            <span className={`text-sm font-medium ${yearly ? "text-primary" : "text-muted-foreground"}`}>Yearly <span className="text-savings text-xs">Save 17%</span></span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TIERS.map((t) => {
              const price = yearly ? t.yearly : t.monthly;
              return (
                <div key={t.id} className={`rounded-3xl p-8 ${t.featured ? "bg-primary text-primary-foreground ring-2 ring-accent" : "bg-card ring-1 ring-border"}`}>
                  <div className={`text-xs font-semibold uppercase tracking-wider ${t.featured ? "text-accent" : "text-muted-foreground"}`}>{t.name}</div>
                  <div className="mt-4 flex items-baseline gap-1">
                    <div className="text-4xl font-semibold">{price === 0 ? "₹0" : `₹${price.toLocaleString("en-IN")}`}</div>
                    <div className={`text-sm ${t.featured ? "text-white/60" : "text-muted-foreground"}`}>{price === 0 ? "forever" : yearly ? "/ year" : "/ month"}</div>
                  </div>
                  <ul className="mt-6 space-y-3 text-sm">
                    {t.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check className={`size-4 mt-0.5 shrink-0 ${t.featured ? "text-accent" : "text-savings"}`} /> {f}
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => handleUpgrade(t.id)} className={`mt-8 w-full py-3 rounded-xl text-sm font-semibold ${t.featured ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"}`}>
                    {t.id === "free" ? "Get Started" : "Upgrade"}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-16 bg-card ring-1 ring-border rounded-2xl overflow-hidden">
            <div className="p-6 border-b font-medium">Feature Comparison</div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-4">Feature</th>
                    {TIERS.map((t) => <th key={t.id} className="p-4 text-center">{t.name}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {COMPARE.map((f) => (
                    <tr key={f} className="border-b">
                      <td className="p-4">{f}</td>
                      {TIERS.map((t) => (
                        <td key={t.id} className="p-4 text-center">
                          {t.features.some((tf) => tf.toLowerCase().includes(f.toLowerCase().split(" ")[0])) || (f === "Browse deals" && t.id === "free") ? <Check className="size-4 mx-auto text-savings" /> : "—"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-medium text-center mb-8">Frequently Asked Questions</h2>
            <div className="max-w-2xl mx-auto space-y-3">
              {FAQ.map((item, i) => (
                <div key={i} className="bg-card ring-1 ring-border rounded-xl overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left font-medium">
                    {item.q}
                    <ChevronDown className={`size-4 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === i && <div className="px-4 pb-4 text-sm text-muted-foreground">{item.a}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
