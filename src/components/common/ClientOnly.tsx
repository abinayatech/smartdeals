import { useEffect, useState, type ReactNode } from "react";

/** Renders children only after mount — required for Leaflet SSR safety */
export function ClientOnly({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return fallback;
  return children;
}
