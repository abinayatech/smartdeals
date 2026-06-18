import { useMemo } from "react";
import { catalogRepository } from "@/data/repositories";
import type { Product } from "@/lib/mock-data";

/** Returns products similar by category, excluding given ids. */
export function useProductRecommendations(
  source: Product | null,
  excludeIds: string[] = [],
  limit = 4,
): Product[] {
  return useMemo(() => {
    if (!source) return [];
    const excluded = new Set([source.id, ...excludeIds]);
    return catalogRepository
      .getProducts()
      .filter((p) => p.categoryId === source.categoryId && !excluded.has(p.id))
      .sort((a, b) => b.dealScore - a.dealScore)
      .slice(0, limit);
  }, [source, excludeIds, limit]);
}
