import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Eye, EyeOff, Home } from "lucide-react";
import { useState } from "react";
import authHero from "@/assets/auth-hero.jpg";
import { useAuth } from "@/lib/auth-context";
import { findAccountByEmail } from "@/lib/auth-service";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In · Smart Deal" },
      { name: "description", content: "Sign in or create your free Smart Deal account to save smarter." },
    ],
  }),
  component: AuthPage,
  validateSearch: (s: Record<string, unknown>) => ({
  next: typeof s.next === "string"
    ? s.next
    : "/"
}),
});

function AuthPage() {
  const { next } = Route.useSearch();
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [remember, setRemember] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      const f = new FormData(e.currentTarget);
      if (mode === "signin") {
        await signIn(String(f.get("email")), String(f.get("password")), remember);
      } else {
        const password = String(f.get("password"));
        const confirm = String(f.get("confirm"));
        if (password !== confirm) throw new Error("Passwords do not match.");
        await signUp({
          fullName: String(f.get("fullName")),
          email: String(f.get("email")),
          mobile: String(f.get("mobile")),
          password,
          confirmPassword: confirm,
        });
      }
      navigate({ href: next });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    const emailInput = document.querySelector<HTMLInputElement>('input[name="email"]');
    const email = emailInput?.value?.trim();
    if (!email) {
      setError("Enter your email address first, then click Forgot password.");
      return;
    }
    const account = findAccountByEmail(email);
    if (!account) {
      setError("No account found with that email.");
      return;
    }
    setError(null);
    setInfo("Password reset simulation completed.");
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="flex flex-col p-8 md:p-12">
        <div className="flex items-center gap-2">
          <Link to="/" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ring-1 ring-border bg-card text-sm font-medium text-secondary hover:ring-accent/40">
            <ArrowLeft className="size-4" /> Back
          </Link>
          <Link to="/" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ring-1 ring-border bg-card text-sm font-medium text-secondary hover:ring-accent/40">
            <Home className="size-4" /> Home
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md py-12">
            <div className="flex items-center gap-2 mb-10">
              <span className="size-8 rounded-lg bg-primary grid place-items-center">
                <span className="size-3 rounded-sm bg-accent" />
              </span>
              <span className="font-semibold tracking-tight text-lg">Smart Deal</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-balance">
              {mode === "signin" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {mode === "signin" ? "Sign in to continue saving smarter." : "Start saving smarter in under a minute."}
            </p>

            <form onSubmit={onSubmit} className="mt-8 space-y-4">
              {mode === "signup" && (
                <>
                  <Field name="fullName" label="Full Name" placeholder="Aanya Sharma" required />
                  <Field name="mobile" label="Mobile Number" placeholder="+91 98765 43210" type="tel" required />
                </>
              )}
              <Field name="email" label="Email" placeholder="you@example.com" type="email" required />

              <div>
                <label className="text-xs font-medium text-secondary uppercase tracking-wider">Password</label>
                <div className="relative mt-1.5">
                  <input
                    name="password"
                    type={show ? "text" : "password"}
                    placeholder={mode === "signin" ? "Your password" : "At least 8 characters"}
                    required
                    className="w-full bg-card ring-1 ring-border rounded-xl px-4 py-3 pr-11 text-sm outline-none focus:ring-accent focus:ring-2"
                  />
                  <button type="button" onClick={() => setShow((v) => !v)} aria-label="Toggle password visibility" className="absolute right-3 inset-y-0 my-auto text-muted-foreground hover:text-primary">
                    {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {mode === "signup" && (
                <Field name="confirm" label="Confirm Password" type="password" required />
              )}

              {mode === "signin" && (
                <div className="flex items-center justify-between text-sm">
                  <label className="inline-flex items-center gap-2 text-secondary cursor-pointer">
                    <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="size-4 accent-accent" /> Remember me
                  </label>
                  <button type="button" onClick={handleForgotPassword} className="text-accent hover:underline font-medium">Forgot password?</button>
                </div>
              )}

              {error && (
                <div className="text-sm text-destructive bg-destructive/5 ring-1 ring-destructive/20 rounded-lg px-3 py-2">{error}</div>
              )}
              {info && (
                <div className="text-sm text-savings bg-savings/5 ring-1 ring-savings/20 rounded-lg px-3 py-2">{info}</div>
              )}

              <button disabled={loading} className="w-full py-3 rounded-xl bg-accent text-accent-foreground font-semibold hover:opacity-90 disabled:opacity-60">
                {loading ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account"}
              </button>

              <p className="text-center text-sm text-muted-foreground">
                {mode === "signin" ? "New to Smart Deal? " : "Already have an account? "}
                <button type="button" onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null); setInfo(null); }} className="text-accent font-semibold hover:underline">
                  {mode === "signin" ? "Create account" : "Sign in"}
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>

      <div className="hidden lg:block relative">
        <img src={authHero} alt="Smart Deal shopping" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-tr from-primary/60 via-primary/10 to-transparent" />
        <div className="absolute bottom-10 left-10 right-10 text-white">
          <div className="text-xs uppercase tracking-widest text-accent font-semibold mb-3">Smart Deal Members</div>
          <h2 className="text-3xl font-medium tracking-tight max-w-md">"Saved ₹14,200 last month by following AI-recommended buy windows."</h2>
          <p className="mt-3 text-white/70 text-sm">— Priya, Mumbai</p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, name, type = "text", placeholder, required }: { label: string; name: string; type?: string; placeholder?: string; required?: boolean }) {
  return (
    <div>
      <label className="text-xs font-medium text-secondary uppercase tracking-wider">{label}</label>
      <input name={name} type={type} placeholder={placeholder} required={required} className="mt-1.5 w-full bg-card ring-1 ring-border rounded-xl px-4 py-3 text-sm outline-none focus:ring-accent focus:ring-2" />
    </div>
  );
}
