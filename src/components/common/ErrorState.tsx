import type { ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type ErrorStateProps = {
  title?: string;
  description?: string;
  icon?: ReactNode;
  onRetry?: () => void;
  retryLabel?: string;
};

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this section. Please try again.",
  icon,
  onRetry,
  retryLabel = "Try again",
}: ErrorStateProps) {
  return (
    <div className="text-center py-16 sm:py-20 bg-card ring-1 ring-destructive/20 rounded-2xl shadow-card px-6">
      <div className="flex justify-center mb-4 text-destructive">
        {icon ?? <AlertCircle className="size-10" />}
      </div>
      <h3 className="font-medium text-lg">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">{description}</p>
      {onRetry && (
        <Button variant="outline" className="mt-6" onClick={onRetry}>{retryLabel}</Button>
      )}
    </div>
  );
}
