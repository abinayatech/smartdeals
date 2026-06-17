import { createFileRoute } from "@tanstack/react-router";
import { Bell, MapPin, Sparkles, TrendingDown } from "lucide-react";
import { FloatingNav } from "@/components/layout/FloatingNav";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications · Smart Deal" }] }),
  component: NotifPage,
});

const NOTIFS = [
  { icon: <TrendingDown className="size-4 text-savings" />, title: "Price drop on QuietComfort Ultra", body: "Croma reduced price by ₹2,400. Buy now?", time: "12m" },
  { icon: <MapPin className="size-4 text-accent" />, title: "Nearby flash deal", body: "Nature's Basket: 50% off Hass Avocados — 0.8 km away.", time: "1h" },
  { icon: <Sparkles className="size-4 text-warning" />, title: "AI recommendation", body: "Wait until Saturday to buy the Ninja Blender — predicted 12% drop.", time: "3h" },
  { icon: <Bell className="size-4 text-primary" />, title: "Order packed", body: "SD-19170 from Croma is packed and on the way.", time: "Yesterday" },
];

function NotifPage() {
  return (
    <div className="min-h-screen bg-background">
      <FloatingNav />
      <PageHeader eyebrow="Inbox" title="Notifications" subtitle="Price drops, order updates and AI suggestions." />
      <section className="px-6 pb-24">
        <div className="max-w-3xl mx-auto space-y-3">
          {NOTIFS.map((n, i) => (
            <button key={i} className="w-full text-left bg-card ring-1 ring-border rounded-2xl p-5 flex items-start gap-4 hover:ring-accent/40 transition-all">
              <div className="size-10 rounded-lg bg-muted grid place-items-center shrink-0">{n.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="font-medium">{n.title}</div>
                <div className="text-sm text-muted-foreground mt-0.5">{n.body}</div>
              </div>
              <div className="text-xs text-muted-foreground shrink-0">{n.time}</div>
            </button>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}