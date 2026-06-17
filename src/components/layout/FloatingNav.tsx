import { Link } from "@tanstack/react-router";
import { Bell, Heart, Menu, Search, ShoppingCart, Sparkles, User as UserIcon, X } from "lucide-react";
import { useState } from "react";
import { useAuth, useRequireAuth } from "@/lib/auth-context";

const NAV_LINKS = [
  { to: "/categories", label: "Categories" },
  { to: "/stores", label: "Stores" },
  { to: "/deal-map", label: "Deal Map" },
  { to: "/ai-planner", label: "AI Planner" },
] as const;

const DRAWER_LINKS = [
  { to: "/", label: "Home" },
  { to: "/categories", label: "Categories" },
  { to: "/stores", label: "Stores" },
  { to: "/products", label: "Deals" },
  { to: "/deal-map", label: "Deal Map" },
  { to: "/favorites", label: "Favorites", auth: true },
  { to: "/cart", label: "Cart", auth: true },
  { to: "/ai-planner", label: "AI Planner", auth: true },
  { to: "/orders", label: "Orders", auth: true },
  { to: "/notifications", label: "Notifications", auth: true },
  { to: "/dashboard", label: "Dashboard", auth: true },
  { to: "/profile", label: "Profile", auth: true },
  { to: "/settings", label: "Settings", auth: true },
  { to: "/about", label: "About" },
  { to: "/pricing", label: "Pricing" },
  { to: "/contact", label: "Contact" },
] as const;

export function FloatingNav() {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, signOut } = useAuth();
  const guard = useRequireAuth();

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
                <Link
                  key={l.to}
                  to={l.to}
                  className="text-sm font-medium text-secondary hover:text-primary transition-colors"
                  activeProps={{ className: "text-primary" }}
                >
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
                window.location.href = `/products?q=${encodeURIComponent(q)}`;
              }}
              className="relative"
            >
              <Search className="size-4 text-muted-foreground absolute inset-y-0 left-3 my-auto" />
              <input
                name="q"
                type="text"
                placeholder="Search 'iPhone 15' or 'Organic Milk'..."
                className="w-full bg-muted/60 rounded-lg py-2 pl-9 pr-4 text-sm ring-1 ring-border focus:ring-accent focus:ring-2 outline-none placeholder:text-muted-foreground/70"
              />
            </form>
          </div>

          <div className="flex items-center gap-1">
            <IconBtn label="Favorites" onClick={() => guard(() => (window.location.href = "/favorites"))}>
              <Heart className="size-4" />
            </IconBtn>
            <IconBtn label="Cart" onClick={() => guard(() => (window.location.href = "/cart"))}>
              <ShoppingCart className="size-4" />
            </IconBtn>
            <IconBtn label="Notifications" onClick={() => guard(() => (window.location.href = "/notifications"))}>
              <Bell className="size-4" />
            </IconBtn>
            <div className="hidden md:block h-4 w-px bg-border mx-1" />
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="hidden md:inline-flex items-center gap-2 py-1.5 pr-3 pl-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg"
              >
                <UserIcon className="size-4" />
                {user?.fullName.split(" ")[0]}
              </Link>
            ) : (
              <Link
                to="/auth"
                className="hidden md:inline-flex items-center gap-2 py-1.5 pr-3 pl-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90"
              >
                <UserIcon className="size-4" />
                Sign In
              </Link>
            )}
            <button
              aria-label="Menu"
              onClick={() => setOpen(true)}
              className="p-2 rounded-lg text-secondary hover:bg-muted transition-colors"
            >
              <Menu className="size-4" />
            </button>
          </div>
        </div>
      </nav>

      {open && (
        <div className="fixed inset-0 z-[60]">
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
                    setOpen(false);
                    if ("auth" in l && l.auth) guard(() => (window.location.href = l.to));
                    else window.location.href = l.to;
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-secondary hover:bg-muted hover:text-primary"
                >
                  {l.label}
                </button>
              ))}
              <div className="my-2 border-t" />
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    signOut();
                    setOpen(false);
                    window.location.href = "/";
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/auth"
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
    <button
      aria-label={label}
      onClick={onClick}
      className="p-2 rounded-lg text-secondary hover:bg-muted transition-colors"
    >
      {children}
    </button>
  );
}