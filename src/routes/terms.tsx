import { createFileRoute } from "@tanstack/react-router";
import { FloatingNav } from "@/components/layout/FloatingNav";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms of Service · Smart Deal" }] }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <FloatingNav />
      <PageHeader title="Terms of Service" subtitle="Last updated: June 2024" breadcrumbs={[{ label: "Terms of Service" }]} />
      <section className="px-6 pb-24">
        <div className="max-w-3xl mx-auto prose prose-stone space-y-6 text-secondary">
          <p>By using Smart Deal, you agree to these Terms of Service. Please read them carefully.</p>
          <h2 className="text-xl font-medium text-primary">Service Description</h2>
          <p>Smart Deal provides retail intelligence, price comparison, deal discovery, and AI-powered shopping planning. This demonstration application uses simulated data and mock payment processing.</p>
          <h2 className="text-xl font-medium text-primary">Account Registration</h2>
          <p>You must provide accurate information when creating an account. You are responsible for maintaining the confidentiality of your password and for all activities under your account.</p>
          <h2 className="text-xl font-medium text-primary">Pricing & Payments</h2>
          <p>Deal prices displayed are based on our best available data and may differ from in-store prices. Payment processing in this demo is simulated — no real transactions occur.</p>
          <h2 className="text-xl font-medium text-primary">Subscriptions</h2>
          <p>Paid plans (Smart Plus, Smart Pro, Enterprise) are billed monthly or annually. You may cancel at any time through Settings. Refunds are processed within 7 business days.</p>
          <h2 className="text-xl font-medium text-primary">Limitation of Liability</h2>
          <p>Smart Deal provides information on an "as is" basis. We are not liable for pricing discrepancies, stock availability, or delivery issues with third-party stores.</p>
          <h2 className="text-xl font-medium text-primary">Contact</h2>
          <p>Questions about these terms? Email legal@smartdeal.com or visit our Contact page.</p>
        </div>
      </section>
      <Footer />
    </div>
  );
}
