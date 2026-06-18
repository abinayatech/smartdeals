import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

export type Crumb = { label: string; to?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-muted-foreground mb-4 flex-wrap">
      <Link to="/" className="hover:text-primary transition-colors">Home</Link>
      {items.map((item, i) => (
        <span key={i} className="inline-flex items-center gap-1">
          <ChevronRight className="size-3" />
          {item.to ? (
            <Link to={item.to} className="hover:text-primary transition-colors">{item.label}</Link>
          ) : (
            <span className="text-secondary font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
