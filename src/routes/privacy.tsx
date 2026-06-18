import { createFileRoute } from "@tanstack/react-router";
import { FloatingNav } from "@/components/layout/FloatingNav";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy Policy · Smart Deal" }] }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <FloatingNav />
      <PageHeader title="Privacy Policy" subtitle="Last updated: June 2024" breadcrumbs={[{ label: "Privacy Policy" }]} />
      <section className="px-6 pb-24">
        <div className="max-w-3xl mx-auto prose prose-stone space-y-6 text-secondary">
          <p>Smart Deal Intelligence Ltd. ("Smart Deal", "we", "us") is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information.</p>
          <h2 className="text-xl font-medium text-primary">Information We Collect</h2>
          <p>We collect information you provide directly: name, email, mobile number, delivery addresses, and shopping preferences. All data in this demo is stored locally on your device using localStorage.</p>
          <h2 className="text-xl font-medium text-primary">How We Use Your Data</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Personalize deal recommendations and AI shopping plans</li>
            <li>Process orders and send notifications</li>
            <li>Improve our pricing prediction models</li>
            <li>Provide customer support</li>
          </ul>
          <h2 className="text-xl font-medium text-primary">Data Storage</h2>
          <p>In this demonstration version, all data is stored locally in your browser. No data is transmitted to external servers. In a production deployment, data would be encrypted and stored in compliance with Indian data protection regulations.</p>
          <h2 className="text-xl font-medium text-primary">Your Rights</h2>
          <p>You can access, update, or delete your data at any time through your Profile and Settings pages. Contact us at privacy@smartdeal.com for additional requests.</p>
          <h2 className="text-xl font-medium text-primary">Contact</h2>
          <p>Smart Deal Intelligence Ltd., Hill Road, Bandra West, Mumbai 400050. Email: privacy@smartdeal.com</p>
        </div>
      </section>
      <Footer />
    </div>
  );
}
