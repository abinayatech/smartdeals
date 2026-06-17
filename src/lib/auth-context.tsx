import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type User = {
  id: string;
  fullName: string;
  email: string;
  mobile?: string;
};

type AuthCtx = {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: { fullName: string; email: string; mobile: string; password: string }) => Promise<void>;
  signOut: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthCtx | null>(null);

const STORAGE_KEY = "smartdeal.user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
      if (raw) setUser(JSON.parse(raw) as User);
    } catch {}
    setLoading(false);
  }, []);

  const persist = (u: User | null) => {
    setUser(u);
    if (typeof window === "undefined") return;
    if (u) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else window.localStorage.removeItem(STORAGE_KEY);
  };

  const signIn: AuthCtx["signIn"] = async (email, password) => {
    await new Promise((r) => setTimeout(r, 400));
    if (!email || !password) throw new Error("Please enter your email and password.");
    if (password.length < 6) throw new Error("Incorrect email or password.");
    persist({
      id: crypto.randomUUID(),
      fullName: email.split("@")[0].replace(/\b\w/g, (c) => c.toUpperCase()),
      email,
    });
  };

  const signUp: AuthCtx["signUp"] = async ({ fullName, email, mobile, password }) => {
    await new Promise((r) => setTimeout(r, 500));
    if (!fullName || !email || !mobile || !password) throw new Error("Please fill in every field.");
    if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error("Please enter a valid email.");
    if (password.length < 8) throw new Error("Password must be at least 8 characters.");
    persist({ id: crypto.randomUUID(), fullName, email, mobile });
  };

  const signOut = () => persist(null);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, signIn, signUp, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthCtx {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

/** Wrap an action that requires login; redirects to /auth if not signed in. */
export function useRequireAuth() {
  const { isAuthenticated } = useAuth();
  return (action: () => void, redirectTo: string = "/auth") => {
    if (isAuthenticated) {
      action();
    } else if (typeof window !== "undefined") {
      const here = window.location.pathname + window.location.search;
      window.location.href = `${redirectTo}?next=${encodeURIComponent(here)}`;
    }
  };
}