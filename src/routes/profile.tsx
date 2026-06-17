import { createFileRoute } from "@tanstack/react-router";
import { FloatingNav } from "@/components/layout/FloatingNav";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile · Smart Deal" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, signOut } = useAuth();
  return (
    <div className="min-h-screen bg-background">
      <FloatingNav />
      <PageHeader eyebrow="Account" title="Your profile" subtitle="Manage personal details, addresses and preferences." />
      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto grid md:grid-cols-[240px_1fr] gap-8">
          <div className="bg-card ring-1 ring-border rounded-2xl p-6 text-center h-fit">
            <div className="size-20 rounded-full bg-accent text-accent-foreground grid place-items-center text-2xl font-semibold mx-auto">
              {user?.fullName.charAt(0).toUpperCase() ?? "U"}
            </div>
            <div className="mt-4 font-medium">{user?.fullName ?? "Guest"}</div>
            <div className="text-xs text-muted-foreground">{user?.email ?? "—"}</div>
            <button onClick={() => { signOut(); window.location.href = "/"; }} className="mt-5 w-full py-2 text-sm font-medium text-destructive ring-1 ring-destructive/30 rounded-lg hover:bg-destructive/5">Logout</button>
          </div>
          <div className="space-y-4">
            <Card title="Personal Details">
              <Row label="Full Name" value={user?.fullName ?? "—"} />
              <Row label="Email" value={user?.email ?? "—"} />
              <Row label="Mobile" value={user?.mobile ?? "—"} />
            </Card>
            <Card title="Preferences">
              <Row label="Monthly Budget" value="₹25,000" />
              <Row label="Favorite Categories" value="Grocery, Electronics, Beauty" />
              <Row label="Preferred Stores" value="Blinkit, Croma, Nykaa" />
            </Card>
            <Card title="Saved Addresses">
              <Row label="Home" value="Hill Road, Bandra West, Mumbai 400050" />
              <Row label="Office" value="BKC Tower 2, Bandra Kurla Complex" />
            </Card>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card ring-1 ring-border rounded-2xl p-6">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary">{title}</h3>
      <dl className="mt-4 space-y-3">{children}</dl>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-right">{value}</dd>
    </div>
  );
}