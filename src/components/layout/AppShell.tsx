import type { ReactNode } from "react";
import { FloatingNav } from "./FloatingNav";
import { Footer } from "./Footer";
import { PageHeader } from "./PageHeader";
import type { Crumb } from "./Breadcrumbs";

type AppShellProps = {
  children: ReactNode;
  /** When true, only nav + footer — no PageHeader wrapper */
  bare?: boolean;
  header?: {
    eyebrow?: string;
    title: string;
    subtitle?: string;
    breadcrumbs?: Crumb[];
    actions?: ReactNode;
  };
  /** Full-width inner content (no max-w-6xl) */
  wide?: boolean;
};

export function AppShell({ children, bare, header, wide }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <FloatingNav />
      {header && !bare && (
        <PageHeader
          eyebrow={header.eyebrow}
          title={header.title}
          subtitle={header.subtitle}
          breadcrumbs={header.breadcrumbs}
          actions={header.actions}
        />
      )}
      <section className="px-4 sm:px-6 pb-20 sm:pb-24">
        <div className={wide ? "" : "max-w-6xl mx-auto"}>{children}</div>
      </section>
      <Footer />
    </div>
  );
}
