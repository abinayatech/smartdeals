import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Award, Gift } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { getLoyaltyProfile, redeemReward } from "@/services/loyalty-service";
import { requireAuth } from "@/lib/route-guard";

export const Route = createFileRoute("/loyalty")({
  head: () => ({ meta: [{ title: "Loyalty Program · Smart Deal" }] }),
  beforeLoad: () => requireAuth("/loyalty"),
  component: LoyaltyPage,
});

function LoyaltyPage() {
  const { user } = useAuth();
  const [tick, setTick] = useState(0);
  const profile = user ? getLoyaltyProfile(user.id) : null;

  if (!profile) return null;

  return (
    <AppShell
      header={{
        eyebrow: "Rewards",
        title: "Smart Deal Loyalty",
        subtitle: `${profile.points.toLocaleString()} points · ${profile.tier} tier`,
        breadcrumbs: [{ label: "Loyalty" }],
      }}
    >
      <div className="space-y-8 animate-slide-up" key={tick}>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-primary text-primary-foreground rounded-2xl p-6 shadow-card">
            <div className="text-sm opacity-80">Your points</div>
            <div className="text-4xl font-semibold mt-1">{profile.points.toLocaleString()}</div>
            <div className="text-sm mt-2">{profile.tier} Member</div>
          </div>
          <div className="bg-card ring-1 ring-border rounded-2xl p-6 shadow-card sm:col-span-2">
            <h3 className="font-medium flex items-center gap-2"><Award className="size-4 text-accent" /> Badges</h3>
            <div className="flex flex-wrap gap-2 mt-3">
              {profile.badges.length === 0 && <span className="text-sm text-muted-foreground">Shop more to earn badges</span>}
              {profile.badges.map((b) => (
                <span key={b} className="px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full">{b}</span>
              ))}
            </div>
          </div>
        </div>

        <section>
          <h3 className="font-medium mb-4">Spending milestones</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {profile.milestones.map((m) => (
              <div key={m.id} className="bg-card ring-1 ring-border rounded-xl p-4 shadow-card">
                <div className="font-medium text-sm">{m.title}</div>
                <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-accent" style={{ width: `${(m.progress / m.target) * 100}%` }} />
                </div>
                <div className="text-xs text-muted-foreground mt-1">₹{m.progress.toLocaleString()} / ₹{m.target.toLocaleString()}{m.unlockedAt ? " · Unlocked" : ""}</div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="font-medium mb-4 flex items-center gap-2"><Gift className="size-4" /> Rewards</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {profile.rewards.map((r) => (
              <div key={r.id} className="bg-card ring-1 ring-border rounded-xl p-4 flex justify-between items-center shadow-card">
                <div>
                  <div className="font-medium text-sm">{r.title}</div>
                  <div className="text-xs text-muted-foreground">{r.pointsCost} points</div>
                </div>
                <Button size="sm" disabled={r.redeemed || profile.points < r.pointsCost} onClick={() => { redeemReward(r.id); setTick((t) => t + 1); }}>
                  {r.redeemed ? "Redeemed" : "Redeem"}
                </Button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
