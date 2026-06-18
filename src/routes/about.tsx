import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FloatingNav } from "@/components/layout/FloatingNav";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About · Smart Deal" }, { name: "description", content: "How Smart Deal is rebuilding retail intelligence for India." }] }),
  component: AboutPage,
});

const TEAM = [
  { name: "Aanya Sharma", role: "CEO & Co-founder", bio: "Ex-Flipkart, 12 years in retail tech." },
  { name: "Rohan Mehta", role: "CTO", bio: "Built ML systems at Swiggy and PhonePe." },
  { name: "Priya Nair", role: "Head of AI", bio: "PhD in ML, former Google Research." },
  { name: "Arjun Patel", role: "Head of Product", bio: "Led consumer apps at Paytm and CRED." },
];

const ROADMAP = [
  { q: "Q1 2024", title: "Mumbai Launch", desc: "Live in Bandra, Andheri, Powai with 500+ stores." },
  { q: "Q2 2024", title: "AI Planner v2", desc: "Multi-store route optimization and price prediction." },
  { q: "Q3 2024", title: "Delhi & Bangalore", desc: "Expand to 3 new cities with 2,000+ stores." },
  { q: "Q4 2024", title: "Family Plans", desc: "Shared carts, household budgets, and savings reports." },
  { q: "Q1 2025", title: "Pan-India", desc: "15 cities, 10,000+ stores, offline-first mode." },
  { q: "Q2 2025", title: "Enterprise", desc: "B2B analytics for retailers and brands." },
];

const FAQ = [
  { q: "How does Smart Deal find deals?", a: "Our AI scans pricing signals from 500+ stores in real time, compares historical prices, and surfaces the best deals near you — all offline in demo mode." },
  { q: "Is Smart Deal free?", a: "Yes! The Free plan lets you browse deals, save favorites, and use the deal map. Smart Plus and Pro unlock AI Planner and advanced predictions." },
  { q: "Which cities are supported?", a: "We launched in Mumbai with 9 neighborhoods. Delhi, Bangalore, and Pune are coming in 2025." },
  { q: "How accurate are price predictions?", a: "Our model achieves 78-85% accuracy on 14-day price drop predictions based on historical retail data patterns." },
];

function AboutPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <FloatingNav />
      <PageHeader eyebrow="About" title="Retail intelligence, built for India." subtitle="Smart Deal is on a mission to make smarter shopping the default — not the exception." breadcrumbs={[{ label: "About" }]} />
      <section className="px-6 pb-24 space-y-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-medium">Our Mission</h2>
          <p className="mt-4 text-lg text-secondary">To democratize retail intelligence for every Indian household — ensuring no family overpays for groceries, electronics, fashion, or daily essentials again.</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-medium">Our Vision</h2>
          <p className="mt-4 text-lg text-secondary">A India where every purchase is informed by real-time data, AI-powered predictions, and localized deal discovery — making ₹10,000+ in annual savings accessible to every shopper.</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-medium">Our Story</h2>
          <p className="mt-4 text-secondary">We started Smart Deal in 2023 because shopping in India is fragmented across dozens of online and offline stores. Prices change daily. Discounts hide behind apps. And the average household leaves thousands of rupees on the table every month.</p>
          <p className="mt-4 text-secondary">Our founders — veterans from Flipkart, Swiggy, and Google — built an AI layer that reads pricing signals from hundreds of stores in real time, predicts price drops, and helps you split your cart across the right stores at the right time.</p>
        </div>

        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat n="₹4.2 Cr" l="Total saved by members" />
          <Stat n="42,000+" l="Stores tracked daily" />
          <Stat n="2.1L+" l="Active members" />
          <Stat n="9 cities" l="Live coverage (2025)" />
          <Stat n="500+" l="Product categories" />
          <Stat n="78%" l="Prediction accuracy" />
          <Stat n="4.6★" l="Average app rating" />
          <Stat n="35 min" l="Avg. time saved per trip" />
        </div>

        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-medium mb-8">Roadmap</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ROADMAP.map((r) => (
              <div key={r.q} className="bg-card ring-1 ring-border rounded-2xl p-5">
                <div className="text-xs font-bold text-accent uppercase tracking-wider">{r.q}</div>
                <div className="font-medium mt-2">{r.title}</div>
                <p className="text-sm text-muted-foreground mt-1">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-medium mb-8">Meet the Team</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((m) => (
              <div key={m.name} className="bg-card ring-1 ring-border rounded-2xl p-6 text-center">
                <div className="size-16 rounded-full bg-accent text-accent-foreground grid place-items-center text-xl font-semibold mx-auto">{m.name.charAt(0)}</div>
                <div className="font-medium mt-4">{m.name}</div>
                <div className="text-xs text-accent font-semibold mt-1">{m.role}</div>
                <p className="text-sm text-muted-foreground mt-2">{m.bio}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-medium mb-8 text-center">FAQ</h2>
          <div className="space-y-3">
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

        <div className="max-w-3xl mx-auto text-center bg-primary text-primary-foreground rounded-3xl p-12">
          <h2 className="text-3xl font-medium">Ready to start saving?</h2>
          <p className="mt-3 text-white/70">Join 2 lakh+ Smart Deal members saving an average of ₹14,200 per year.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/auth" className="px-8 py-3 bg-accent text-accent-foreground rounded-xl font-semibold" search={undefined}>Create Free Account</Link>
            <Link to="/contact" className="px-8 py-3 ring-1 ring-white/30 rounded-xl font-semibold">Contact Us</Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div className="bg-card ring-1 ring-border rounded-2xl p-5">
      <div className="text-2xl font-semibold">{n}</div>
      <div className="text-xs text-muted-foreground mt-1">{l}</div>
    </div>
  );
}
