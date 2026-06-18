import type { PricePoint } from "@/models";
import { getProductById } from "@/lib/mock-data";
import { createSeededRandom } from "@/lib/seeded-random";

export type PriceHistoryStats = {
  points7: PricePoint[];
  points30: PricePoint[];
  points90: PricePoint[];
  lowest: number;
  highest: number;
  average: number;
  current: number;
  savings: number;
};

function generateHistory(productId: string, days: number, currentPrice: number, mrp: number): PricePoint[] {
  const rand = createSeededRandom(productId.split("").reduce((a, c) => a + c.charCodeAt(0), 0) + days);
  const points: PricePoint[] = [];
  let price = currentPrice * (1 + (rand() - 0.5) * 0.15);
  for (let d = days; d >= 0; d--) {
    const date = new Date();
    date.setDate(date.getDate() - d);
    price = Math.max(currentPrice * 0.85, Math.min(mrp, price + (rand() - 0.52) * currentPrice * 0.03));
    points.push({ date: date.toISOString().slice(0, 10), price: Math.round(price) });
  }
  points[points.length - 1].price = currentPrice;
  return points;
}

export function getPriceHistory(productId: string): PriceHistoryStats | null {
  const product = getProductById(productId);
  if (!product) return null;
  const points90 = generateHistory(productId, 90, product.price, product.mrp);
  const points30 = points90.slice(-31);
  const points7 = points90.slice(-8);
  const prices = points90.map((p) => p.price);
  const lowest = Math.min(...prices);
  const highest = Math.max(...prices);
  const average = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
  return {
    points7,
    points30,
    points90,
    lowest,
    highest,
    average,
    current: product.price,
    savings: product.mrp - product.price,
  };
}
