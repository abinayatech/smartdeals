import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FloatingNav } from "@/components/layout/FloatingNav";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact · Smart Deal" }] }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <div className="min-h-screen bg-background">
      <FloatingNav />
      <PageHeader eyebrow="Contact" title="Talk to the Smart Deal team." subtitle="We respond to every message within 24 hours, Monday–Friday." />
      <section className="px-6 pb-24">
        <div className="max-w-3xl mx-auto bg-card ring-1 ring-border rounded-2xl p-8">
          {sent ? (
            <div className="text-center py-10">
              <div className="text-4xl">✅</div>
              <h3 className="mt-3 font-medium">Message received</h3>
              <p className="text-sm text-muted-foreground mt-1">We'll reply within one business day.</p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
              <Field label="Name" name="name" required />
              <Field label="Email" name="email" type="email" required />
              <div>
                <label className="text-xs font-medium text-secondary uppercase tracking-wider">Message</label>
                <textarea name="message" rows={5} required className="mt-1.5 w-full bg-background ring-1 ring-border rounded-xl px-4 py-3 text-sm outline-none focus:ring-accent focus:ring-2" />
              </div>
              <button className="w-full py-3 bg-accent text-accent-foreground rounded-xl font-semibold">Send message</button>
            </form>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}

function Field({ label, name, type = "text", required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="text-xs font-medium text-secondary uppercase tracking-wider">{label}</label>
      <input name={name} type={type} required={required} className="mt-1.5 w-full bg-background ring-1 ring-border rounded-xl px-4 py-3 text-sm outline-none focus:ring-accent focus:ring-2" />
    </div>
  );
}