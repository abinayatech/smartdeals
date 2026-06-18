import { useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Star, BadgeCheck, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, useRequireAuth } from "@/lib/auth-context";
import {
  addReview,
  deleteReview,
  getProductReviews,
  getReviewAnalytics,
  getUserReviewForProduct,
  updateReview,
} from "@/services/reviews-service";
import type { CustomerReview } from "@/models";

export function ProductReviews({ productId }: { productId: string }) {
  const guard = useRequireAuth();
  const { user } = useAuth();
  const [reviews, setReviews] = useState(() => getProductReviews(productId));
  const analytics = getReviewAnalytics(productId);
  const myReview = user ? getUserReviewForProduct(productId, user.id) : undefined;
  const [rating, setRating] = useState(myReview?.rating ?? 5);
  const [text, setText] = useState(myReview?.text ?? "");
  const [editing, setEditing] = useState(false);

  const refresh = () => setReviews(getProductReviews(productId));

  const chartData = ([1, 2, 3, 4, 5] as const).map((s) => ({
    star: `${s}★`,
    count: analytics.distribution[s],
  }));

  const submit = () => {
    guard(() => {
      if (myReview && editing) updateReview(myReview.id, { rating, text });
      else addReview(productId, rating, text);
      setEditing(false);
      refresh();
    });
  };

  return (
    <section className="mt-12 space-y-6">
      <h2 className="text-xl font-medium">Customer Reviews</h2>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-card ring-1 ring-border rounded-2xl p-5 shadow-card">
          <div className="text-4xl font-semibold">{analytics.average || "—"}</div>
          <div className="flex items-center gap-1 mt-1 text-warning">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`size-4 ${i < Math.round(analytics.average) ? "fill-warning" : ""}`} />
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-2">{analytics.total} reviews · {analytics.verifiedCount} verified</p>
        </div>
        <div className="lg:col-span-2 bg-card ring-1 ring-border rounded-2xl p-5 shadow-card">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary mb-3">Rating distribution</h3>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={chartData}>
              <XAxis dataKey="star" fontSize={11} />
              <YAxis fontSize={11} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#EA580C" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {user && (
        <div className="bg-card ring-1 ring-border rounded-2xl p-5 shadow-card">
          <h3 className="font-medium mb-3">{myReview ? "Your review" : "Write a review"}</h3>
          <div className="flex gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((s) => (
              <button key={s} type="button" onClick={() => setRating(s)} className="p-1">
                <Star className={`size-5 ${s <= rating ? "fill-warning text-warning" : "text-muted-foreground"}`} />
              </button>
            ))}
          </div>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} placeholder="Share your experience…" className="w-full bg-muted/50 rounded-xl px-4 py-3 text-sm ring-1 ring-border outline-none focus:ring-2 focus:ring-accent" />
          <div className="flex gap-2 mt-3">
            <Button onClick={submit}>{myReview ? (editing ? "Save changes" : "Update") : "Submit review"}</Button>
            {myReview && !editing && <Button variant="outline" onClick={() => setEditing(true)}><Pencil className="size-4 mr-1" /> Edit</Button>}
            {myReview && (
              <Button variant="outline" className="text-destructive" onClick={() => guard(() => { deleteReview(myReview.id); refresh(); setText(""); })}>
                <Trash2 className="size-4 mr-1" /> Delete
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="space-y-3">
        {reviews.slice(0, 10).map((r) => (
          <ReviewCard key={r.id} review={r} isOwn={r.userId === user?.id} />
        ))}
      </div>
    </section>
  );
}

function ReviewCard({ review, isOwn }: { review: CustomerReview; isOwn?: boolean }) {
  return (
    <div className="bg-card ring-1 ring-border rounded-xl p-4 shadow-card">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{review.userName}{isOwn ? " (You)" : ""}</span>
          {review.verifiedPurchase && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold uppercase text-savings bg-savings/10 px-1.5 py-0.5 rounded">
              <BadgeCheck className="size-3" /> Verified
            </span>
          )}
        </div>
        <span className="text-xs inline-flex items-center gap-0.5">
          {Array.from({ length: review.rating }).map((_, i) => <Star key={i} className="size-3 fill-warning text-warning" />)}
        </span>
      </div>
      <p className="text-sm text-secondary mt-2">{review.text}</p>
      {review.images.length > 0 && (
        <div className="flex gap-2 mt-2">
          {review.images.map((img, i) => <img key={i} src={img} alt="" className="size-16 rounded-lg object-cover" />)}
        </div>
      )}
      <p className="text-[10px] text-muted-foreground mt-2">{new Date(review.createdAt).toLocaleDateString("en-IN")}</p>
    </div>
  );
}
