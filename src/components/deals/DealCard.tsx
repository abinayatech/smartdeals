import { Link } from "@tanstack/react-router";
import { Heart, MapPin } from "lucide-react";
import { discountPct, formatINR, type Product } from "@/lib/mock-data";
import { useRequireAuth } from "@/lib/auth-context";

const BADGE_STYLES: Record<NonNullable<Product["badge"]>, string> = {
  "Buy 1 Get 1": "bg-savings text-white",
  "Low Stock": "bg-warning text-white",
  "Lowest in 30 days": "bg-primary text-white",
  Flash: "bg-discount text-white",
};

export function DealCard({ product }: { product: Product }) {
  const guard = useRequireAuth();
  const pct = discountPct(product.price, product.mrp);

  return (
    <div className="group bg-card ring-1 ring-black/5 rounded-2xl p-3 flex flex-col gap-4 hover:ring-accent/30 transition-all">
      <Link to="/product/$id" params={{ id: product.id }} className="relative aspect-[4/5] rounded-xl overflow-hidden bg-muted block">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
        />
        {product.badge && (
          <div className={`absolute top-3 left-3 px-2 py-1 text-[10px] font-semibold rounded uppercase tracking-wider ${BADGE_STYLES[product.badge]}`}>
            {product.badge === "Flash" ? `${pct}% OFF` : product.badge}
          </div>
        )}
        <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur-sm text-primary text-[10px] font-semibold rounded ring-1 ring-black/5">
          Score: {product.dealScore.toFixed(1)}
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            guard(() => (window.location.href = "/favorites"));
          }}
          aria-label="Save deal"
          className="absolute bottom-3 right-3 size-8 rounded-full bg-white/95 grid place-items-center ring-1 ring-black/5 hover:text-accent text-secondary"
        >
          <Heart className="size-4" />
        </button>
      </Link>
      <div className="px-1">
        <div className="flex justify-between items-start mb-1 gap-2">
          <Link to="/product/$id" params={{ id: product.id }} className="font-medium text-sm truncate hover:text-accent">
            {product.name}
          </Link>
          <Link to="/store/$id" params={{ id: product.storeId }} className="text-xs text-muted-foreground shrink-0 hover:text-primary">
            {product.store}
          </Link>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-semibold">{formatINR(product.price)}</span>
          <span className="text-xs text-muted-foreground line-through">{formatINR(product.mrp)}</span>
        </div>
        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
          <span className="text-[10px] font-medium text-savings uppercase tracking-wide">
            Save {formatINR(product.mrp - product.price)}
          </span>
          <span className="text-[10px] text-muted-foreground inline-flex items-center gap-1">
            <MapPin className="size-3" /> {product.distanceKm} km
          </span>
        </div>
      </div>
    </div>
  );
}