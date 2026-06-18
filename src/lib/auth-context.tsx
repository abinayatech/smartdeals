import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  clearSession,
  createSessionTokens,
  loadSession,
  registerAccount,
  saveSession,
  setRememberMe,
  toSessionUser,
  validateAccessToken,
  validateCredentials,
  type SessionUser,
} from "./auth-service";
import { validateSignIn, validateSignUp } from "@/validators/auth.validator";
import { mockDelay } from "@/api/mock-client";

export type User = SessionUser;

type AuthCtx = {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isDealer: boolean;
  signIn: (email: string, password: string, remember?: boolean) => Promise<void>;
  signUp: (data: { fullName: string; email: string; mobile: string; password: string; confirmPassword: string }) => Promise<void>;
  signOut: () => void;
  updateUser: (updates: Partial<User>) => void;
  loading: boolean;
};

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = loadSession();
    if (session && validateAccessToken()) setUser(session);
    else if (session) clearSession();
    setLoading(false);
  }, []);

  const persist = (u: User | null) => {
    setUser(u);
    saveSession(u);
  };

  const signIn: AuthCtx["signIn"] = async (email, password, remember = false) => {
    await mockDelay();
    const parsed = validateSignIn({ email, password });
    if (!parsed.success) throw new Error(parsed.error.errors[0]?.message ?? "Invalid input");
    const account = validateCredentials(parsed.data.email, parsed.data.password);
    if (!account) throw new Error("Incorrect email or password.");
    setRememberMe(remember);
    createSessionTokens();
    persist(toSessionUser(account));
  };

  const signUp: AuthCtx["signUp"] = async (data) => {
    await mockDelay();
    const parsed = validateSignUp(data);
    if (!parsed.success) throw new Error(parsed.error.errors[0]?.message ?? "Invalid input");
    const account = registerAccount(parsed.data);
    createSessionTokens();
    persist(toSessionUser(account));
  };

  const signOut = () => {
    clearSession();
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    saveSession(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        isDealer: user?.role === "dealer" || user?.role === "admin",
        signIn,
        signUp,
        signOut,
        updateUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthCtx {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export function useRequireAuth() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  return (action: () => void) => {
    if (isAuthenticated) {
      action();
    } else {
      const here = typeof window !== "undefined" ? window.location.pathname + window.location.search : "/";
      navigate({ to: "/auth", search: { next: here } });
    }
  };
}
