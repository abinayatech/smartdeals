import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  actionTo?: string;
  onAction?: () => void;
};

export function EmptyState({ icon, title, description, actionLabel, actionTo, onAction }: EmptyStateProps) {
  return (
    <div className="text-center py-16 sm:py-20 bg-card ring-1 ring-border rounded-2xl shadow-card px-6">
      {icon && <div className="text-4xl mb-4 flex justify-center">{icon}</div>}
      <h3 className="font-medium text-lg">{title}</h3>
      {description && <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">{description}</p>}
      {actionLabel && actionTo && (
        <Link to={actionTo} className="mt-6 inline-flex">
          <Button>{actionLabel}</Button>
        </Link>
      )}
      {actionLabel && onAction && !actionTo && (
        <Button className="mt-6" onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}
