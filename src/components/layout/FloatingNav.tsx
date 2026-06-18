import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, Heart, Menu, Search, ShoppingCart, Sparkles, User as UserIcon, X } from "lucide-react";
import { useState } from "react";
import { useAuth, useRequireAuth } from "@/lib/auth-context";
import { useAppStore } from "@/context/app-store";

const NAV_LINKS = [
  { to: "/products", label: "Products" },
  { to: "/deals", label: "Deals" },
  { to: "/compare", label: "Compare" },
  { to: "/deal-map", label: "Deal Map" },
  { to: "/ai-planner", label: "AI Planner" },
] as const;

const DRAWER_LINKS = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/deals", label: "Deals" },
  { to: "/compare", label: "Compare" },
  { to: "/stores", label: "Stores" },
  { to: "/categories", label: "Categories" },
  { to: "/deal-map", label: "Deal Map" },
  { to: "/features", label: "Features" },
  { to: "/favorites", label: "Favorites", auth: true },
  { to: "/cart", label: "Cart", auth: true },
  { to: "/ai-planner", label: "AI Planner", auth: true },
  { to: "/orders", label: "Orders", auth: true },
  { to: "/notifications", label: "Notifications", auth: true },
  { to: "/dashboard", label: "Dashboard", auth: true },
  { to: "/loyalty", label: "Loyalty", auth: true },
  { to: "/profile", label: "Profile", auth: true },
  { to: "/settings", label: "Settings", auth: true },
  { to: "/about", label: "About" },
  { to: "/pricing", label: "Pricing" },
  { to: "/contact", label: "Contact" },
] as const;

export function FloatingNav() {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, signOut } = useAuth();
  const guard = useRequireAuth();
  const navigate = useNavigate();
  const { cartCount: items } = useAppStore();

  const go = (to: string) => {
    setOpen(false);
    navigate({ to: to as "/" });
  };

  return (
    <>
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl">
        <div className="bg-card/85 backdrop-blur-md ring-1 ring-black/5 rounded-2xl px-3 py-2 flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-5">
            <Link to="/" className="flex items-center gap-2 pl-1">
              <span className="size-6 rounded-md bg-primary grid place-items-center">
                <span className="size-2 rounded-sm bg-accent" />
              </span>
              <span className="font-semibold tracking-tight text-primary">Smart Deal</span>
            </Link>
            <div className="hidden lg:flex items-center gap-5">
              {NAV_LINKS.map((l) => (
                <Link key={l.to} to={l.to} className="text-sm font-medium text-secondary hover:text-primary transition-colors" activeProps={{ className: "text-primary" }}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex-1 max-w-md hidden md:block">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const q = (new FormData(e.currentTarget).get("q") as string) || "";
                navigate({ to: "/products", search: { q } });
              }}
              className="relative"
            >
              <Search className="size-4 text-muted-foreground absolute inset-y-0 left-3 my-auto" />
              <input name="q" type="text" placeholder="Search 'iPhone 15' or 'Organic Milk'..." className="w-full bg-muted/60 rounded-lg py-2 pl-9 pr-4 text-sm ring-1 ring-border focus:ring-accent focus:ring-2 outline-none placeholder:text-muted-foreground/70" />
            </form>
          </div>

          <div className="flex items-center gap-1">
            <IconBtn label="Favorites" onClick={() => guard(() => go("/favorites"))}>
              <Heart className="size-4" />
            </IconBtn>
            <IconBtn label="Cart" onClick={() => guard(() => go("/cart"))}>
              <ShoppingCart className="size-4" />
              {items > 0 && <span className="absolute -top-0.5 -right-0.5 size-4 bg-accent text-accent-foreground text-[9px] font-bold rounded-full grid place-items-center">{items}</span>}
            </IconBtn>
            <IconBtn label="Notifications" onClick={() => guard(() => go("/notifications"))}>
              <Bell className="size-4" />
            </IconBtn>
            <div className="hidden md:block h-4 w-px bg-border mx-1" />
            {isAuthenticated ? (
              <Link to="/dashboard" className="hidden md:inline-flex items-center gap-2 py-1.5 pr-3 pl-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg">
                <UserIcon className="size-4" />
                {user?.fullName.split(" ")[0]}
              </Link>
            ) : (
            <Link
  to="/auth"
  search={{ next: "/dashboard" }}
  className="hidden md:inline-flex items-center gap-2 py-1.5 pr-3 pl-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90"
>
                <UserIcon className="size-4" />
                Sign In
              </Link>
            )}
            <button aria-label="Menu" onClick={() => setOpen(true)} className="p-2 rounded-lg text-secondary hover:bg-muted transition-colors">
              <Menu className="size-4" />
            </button>
          </div>
        </div>
      </nav>

      {open && (
        <div className="fixed inset-0 z-60">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-card shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-5 border-b">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-accent" />
                <span className="font-semibold">Smart Deal</span>
              </div>
              <button onClick={() => setOpen(false)} className="p-2 rounded-lg hover:bg-muted">
                <X className="size-4" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-3">
              {DRAWER_LINKS.map((l) => (
                <button
                  key={l.to}
                  onClick={() => {
                    if ("auth" in l && l.auth) guard(() => go(l.to));
                    else go(l.to);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-secondary hover:bg-muted hover:text-primary"
                >
                  {l.label}
                </button>
              ))}
              {isAdmin && (
                <button onClick={() => go("/admin")} className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-accent hover:bg-muted">
                  Admin Dashboard
                </button>
              )}
              <div className="my-2 border-t" />
              {isAuthenticated ? (
                <button onClick={() => { signOut(); setOpen(false); navigate({ to: "/" }); }} className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10">
                  Logout
                </button>
              ) : (
              <Link
  to="/auth"
  search={{ next: "/" }}
  onClick={() => setOpen(false)}
  className="block px-3 py-2.5 rounded-lg text-sm font-medium bg-primary text-primary-foreground text-center"
>
  Sign In / Sign Up
</Link>
              )}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}

function IconBtn({ children, onClick, label }: { children: React.ReactNode; onClick: () => void; label: string }) {
  return (
    <button aria-label={label} onClick={onClick} className="relative p-2 rounded-lg text-secondary hover:bg-muted transition-colors">
      {children}
    </button>
  );
}
