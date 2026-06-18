import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/lib/auth-context";

const LINKS = [
  { to: "/dealer/dashboard", label: "Dashboard" },
  { to: "/dealer/products", label: "Products" },
  { to: "/dealer/orders", label: "Orders" },
  { to: "/dealer/store", label: "Store" },
  { to: "/dealer/analytics", label: "Analytics" },
] as const;

export function DealerShell({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  const { user } = useAuth();
  return (
    <AppShell
      header={{
        eyebrow: "Dealer Portal",
        title,
        subtitle: subtitle ?? `Managing ${user?.storeId ? `store ${user.storeId}` : "your store"}`,
        breadcrumbs: [{ label: "Dealer", to: "/dealer/dashboard" }, { label: title }],
      }}
    >
      <nav className="flex flex-wrap gap-2 mb-8">
        {LINKS.map((l) => (
          <Link key={l.to} to={l.to} className="px-4 py-2 text-sm font-medium rounded-xl ring-1 ring-border bg-card hover:ring-accent/40 transition-all" activeProps={{ className: "ring-accent bg-accent/10 text-accent" }}>
            {l.label}
          </Link>
        ))}
      </nav>
      {children}
    </AppShell>
  );
}
