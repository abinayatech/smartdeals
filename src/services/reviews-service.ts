import type { CustomerReview, ReviewAnalytics } from "@/models";
import { getReviewsForProduct, type Review } from "@/lib/mock-data";
import { GLOBAL_KEYS, readJSON, writeJSON } from "@/utils/storage";
import { getOrders } from "./orders-service";
import { requireUserId } from "@/utils/user-context";
import { loadSession } from "./auth-service";

function allUserReviews(): CustomerReview[] {
  return readJSON<CustomerReview[]>(GLOBAL_KEYS.productReviews, []);
}

function saveAll(reviews: CustomerReview[]) {
  writeJSON(GLOBAL_KEYS.productReviews, reviews);
}

function seedToCustomer(r: Review): CustomerReview {
  return {
    id: r.id,
    productId: r.productId,
    userId: r.userId,
    userName: r.userName,
    rating: r.rating,
    text: r.text,
    images: [],
    verifiedPurchase: Math.random() > 0.4,
    createdAt: r.date,
    updatedAt: r.date,
  };
}

export function getProductReviews(productId: string): CustomerReview[] {
  const userReviews = allUserReviews().filter((r) => r.productId === productId);
  const seed = getReviewsForProduct(productId).map(seedToCustomer);
  const merged = [...userReviews];
  for (const s of seed) {
    if (!merged.some((r) => r.id === s.id)) merged.push(s);
  }
  return merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getReviewAnalytics(productId: string): ReviewAnalytics {
  const reviews = getProductReviews(productId);
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as ReviewAnalytics["distribution"];
  let sum = 0;
  let verifiedCount = 0;
  for (const r of reviews) {
    const star = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
    distribution[star]++;
    sum += r.rating;
    if (r.verifiedPurchase) verifiedCount++;
  }
  return {
    average: reviews.length ? Math.round((sum / reviews.length) * 10) / 10 : 0,
    total: reviews.length,
    distribution,
    verifiedCount,
  };
}

function hasVerifiedPurchase(userId: string, productId: string): boolean {
  return getOrders(userId).some((o) =>
    o.status === "Delivered" && o.items.some((i) => i.productId === productId),
  );
}

export function addReview(productId: string, rating: number, text: string, images: string[] = []) {
  const userId = requireUserId();
  const session = loadSession();
  const review: CustomerReview = {
    id: crypto.randomUUID(),
    productId,
    userId,
    userName: session?.fullName ?? "User",
    rating: Math.min(5, Math.max(1, rating)),
    text,
    images,
    verifiedPurchase: hasVerifiedPurchase(userId, productId),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const all = allUserReviews();
  all.unshift(review);
  saveAll(all);
  return review;
}

export function updateReview(reviewId: string, updates: { rating?: number; text?: string; images?: string[] }) {
  const userId = requireUserId();
  const all = allUserReviews();
  const idx = all.findIndex((r) => r.id === reviewId && r.userId === userId);
  if (idx < 0) throw new Error("Review not found");
  all[idx] = {
    ...all[idx],
    ...updates,
    rating: updates.rating !== undefined ? Math.min(5, Math.max(1, updates.rating)) : all[idx].rating,
    updatedAt: new Date().toISOString(),
  };
  saveAll(all);
  return all[idx];
}

export function deleteReview(reviewId: string) {
  const userId = requireUserId();
  saveAll(allUserReviews().filter((r) => !(r.id === reviewId && r.userId === userId)));
}

export function getUserReviewForProduct(productId: string, userId?: string): CustomerReview | undefined {
  const id = userId ?? requireUserId();
  return allUserReviews().find((r) => r.productId === productId && r.userId === id);
}
