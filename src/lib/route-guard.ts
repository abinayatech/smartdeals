import { redirect } from "@tanstack/react-router";
import { loadSession } from "./auth-service";

const PROTECTED = ["/dashboard", "/favorites", "/cart", "/orders", "/notifications", "/profile", "/settings", "/ai-planner", "/checkout"];
const ADMIN_ONLY = ["/admin"];

export function requireAuth(pathname: string) {
  if (typeof window === "undefined") return;
  const user = loadSession();
  if (!user) {
    throw redirect({ to: "/auth", search: { next: pathname } });
  }
}

export function requireDealer() {
  if (typeof window === "undefined") return;
  const user = loadSession();
  if (!user) throw redirect({ to: "/auth", search: { next: "/dealer/dashboard" } });
  if (user.role !== "dealer" && user.role !== "admin") throw redirect({ to: "/dashboard" });
}

export function requireAdmin() {
  if (typeof window === "undefined") return;
  const user = loadSession();
  if (!user) throw redirect({ to: "/auth", search: { next: "/admin" } });
  if (user.role !== "admin") throw redirect({ to: "/dashboard" });
}

export function isProtectedRoute(path: string) {
  return PROTECTED.some((p) => path === p || path.startsWith(p + "/"));
}

export function isAdminRoute(path: string) {
  return ADMIN_ONLY.some((p) => path === p || path.startsWith(p + "/"));
}
