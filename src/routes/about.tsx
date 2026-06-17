import { createFileRoute } from "@tanstack/react-router";
import { FloatingNav } from "@/components/layout/FloatingNav";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About · Smart Deal" }, { name: "description", content: "How Smart Deal is rebuilding retail intelligence for India." }] }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <FloatingNav />
      <PageHeader eyebrow="About" title="Retail intelligence, built for India." subtitle="Smart Deal is on a mission to make smarter shopping the default — not the exception." />
      <section className="px-6 pb-24">
        <div className="max-w-3xl mx-auto prose prose-stone">
          <p className="text-lg text-secondary">
            We started Smart Deal because shopping in India is fragmented across dozens of online and offline stores. Prices change daily.
            Discounts hide behind apps. And the average household leaves thousands of rupees on the table every month.
          </p>
          <p className="text-secondary mt-6">
            Our AI layer reads pricing signals from hundreds of stores in real time, predicts price drops, and helps you split your cart
            across the right stores at the right time. It's like having a personal procurement team in your pocket.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 mt-10">
            <Stat n="₹4.2 Cr" l="Total saved by members" />
            <Stat n="42,000+" l="Stores tracked daily" />
            <Stat n="9 cities" l="Live coverage" />
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