import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon,
  trend,
  className,
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: ReactNode;
  trend?: { value: string; positive?: boolean };
  className?: string;
}) {
  return (
    <div className={cn("bg-card ring-1 ring-border rounded-2xl p-5 shadow-card shadow-card-hover", className)}>
      <div className="flex items-center justify-between gap-2">
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</div>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      <div className="mt-3 text-2xl font-semibold tracking-tight">{value}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
      {trend && (
        <div className={cn("mt-2 text-xs font-medium", trend.positive ? "text-savings" : "text-muted-foreground")}>
          {trend.value}
        </div>
      )}
    </div>
  );
}
