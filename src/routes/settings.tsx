import { createFileRoute } from "@tanstack/react-router";
import { FloatingNav } from "@/components/layout/FloatingNav";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings · Smart Deal" }] }),
  component: SettingsPage,
});

const SECTIONS = [
  { title: "Account", desc: "Email, phone, profile photo." },
  { title: "Security", desc: "Password, login alerts, two-factor authentication." },
  { title: "Notifications", desc: "Price drops, AI suggestions, order updates." },
  { title: "Appearance", desc: "Light, dark, and reduced motion." },
  { title: "Privacy", desc: "Data sharing, location access, ad personalization." },
];

function SettingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <FloatingNav />
      <PageHeader eyebrow="Settings" title="App settings" subtitle="Control your Smart Deal experience." />
      <section className="px-6 pb-24">
        <div className="max-w-3xl mx-auto space-y-3">
          {SECTIONS.map((s) => (
            <div key={s.title} className="bg-card ring-1 ring-border rounded-2xl p-5 flex items-center justify-between gap-4">
              <div>
                <div className="font-medium">{s.title}</div>
                <div className="text-sm text-muted-foreground">{s.desc}</div>
              </div>
              <button className="px-4 py-2 text-sm font-medium ring-1 ring-border rounded-lg hover:ring-accent/40">Manage</button>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}