import { loadSession, validateAccessToken } from "@/services/auth-service";
import type { SessionUser } from "@/models";

export type AuthContext = {
  user: SessionUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
};

export function getAuthContext(): AuthContext {
  const user = loadSession();
  const tokenValid = user ? validateAccessToken() : false;
  const activeUser = user && tokenValid ? user : null;
  return {
    user: activeUser,
    isAuthenticated: !!activeUser,
    isAdmin: activeUser?.role === "admin",
  };
}

export function requireAuthMiddleware(): SessionUser {
  const { user } = getAuthContext();
  if (!user) throw new Error("Unauthorized");
  return user;
}

export function requireAdminMiddleware(): SessionUser {
  const user = requireAuthMiddleware();
  if (user.role !== "admin") throw new Error("Forbidden");
  return user;
}
