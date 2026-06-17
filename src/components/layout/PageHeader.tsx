import { Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Home } from "lucide-react";
import type { ReactNode } from "react";

/**
 * PageHeader: spec-required Back + Home buttons on every non-home page,
 * plus a section title/subtitle.
 */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  const router = useRouter();
  return (
    <div className="pt-32 pb-8 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <button
            onClick={() => router.history.back()}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ring-1 ring-border bg-card text-sm font-medium text-secondary hover:text-primary hover:ring-accent/40 transition-all"
          >
            <ArrowLeft className="size-4" />
            Back
          </button>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ring-1 ring-border bg-card text-sm font-medium text-secondary hover:text-primary hover:ring-accent/40 transition-all"
          >
            <Home className="size-4" />
            Home
          </Link>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl min-w-0">
            {eyebrow && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/5 ring-1 ring-accent/20 rounded-full text-xs font-medium text-accent uppercase tracking-wider mb-4">
                {eyebrow}
              </div>
            )}
            <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-primary text-balance leading-tight">
              {title}
            </h1>
            {subtitle && <p className="mt-3 text-base text-muted-foreground text-pretty">{subtitle}</p>}
          </div>
          {actions && <div className="shrink-0">{actions}</div>}
        </div>
      </div>
    </div>
  );
}