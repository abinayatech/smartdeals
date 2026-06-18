import { createFileRoute, Link } from "@tanstack/react-router";
import { BarChart3, Heart, ShoppingBag, Sparkles, TrendingUp, Wallet, Eye, Award } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AppShell } from "@/components/layout/AppShell";
import { StatCard } from "@/components/common/StatCard";
import { DealCard } from "@/components/deals/DealCard";
import { useAuth } from "@/lib/auth-context";
import { getAnalytics } from "@/lib/admin-service";
import { useFavorites } from "@/hooks/use-cart";
import { requireAuth } from "@/lib/route-guard";
import { formatINR, getProductById, getStoreById } from "@/lib/mock-data";
import { getShoppingInsights } from "@/services/insights-service";
import { getAchievements } from "@/services/achievements-service";
import { getUserActivity } from "@/services/activity-service";
import { getPersonalizedRecommendations } from "@/services/recommendation-service";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard · Smart Deal" }] }),
  beforeLoad: () => requireAuth("/dashboard"),
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useAuth();
  const { ids: favIds } = useFavorites();
  const name = user?.fullName.split(" ")[0] ?? "there";
  const insights = user ? getShoppingInsights(user.id) : null;
  const activity = user ? getUserActivity(user.id) : null;
  const achievements = user ? getAchievements(user.id) : [];
  const analytics = getAnalytics();
  const recommendations = user ? getPersonalizedRecommendations(user.id, 4) : [];
  const saved = insights?.totalSavings ?? 0;

  return (
    <AppShell
      header={{
        eyebrow: "Dashboard",
        title: `Welcome back, ${name}`,
        subtitle: "Your savings, orders and AI-curated recommendations.",
        breadcrumbs: [{ label: "Dashboard" }],
      }}
    >
      <div className="space-y-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up">
          <StatCard label="Money Saved" value={formatINR(saved)} icon={<Wallet className="size-4 text-savings" />} trend={{ value: `+${formatINR(insights?.monthlySavings ?? 0)} this month`, positive: true }} />
          <StatCard label="Orders" value={String(insights?.totalOrders ?? 0)} icon={<ShoppingBag className="size-4 text-accent" />} />
          <StatCard label="Favorites" value={String(favIds.length)} icon={<Heart className="size-4 text-discount" />} />
          <StatCard label="Deal Success" value={`${insights?.dealSuccessRate ?? 0}%`} icon={<BarChart3 className="size-4 text-warning" />} />
        </div>

        {insights && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up">
            <StatCard label="Monthly Spending" value={formatINR(insights.monthlySpending)} icon={<TrendingUp className="size-4" />} />
            <StatCard label="Favorite Store" value={insights.favoriteStore} icon={<ShoppingBag className="size-4" />} />
            <StatCard label="Top Category" value={insights.mostPurchasedCategory} icon={<Sparkles className="size-4" />} />
            <StatCard label="Purchase Frequency" value={`${insights.purchaseFrequency}/mo`} icon={<BarChart3 className="size-4" />} />
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6 animate-slide-up stagger-1">
          <ChartPanel title="Revenue trend" subtitle="Monthly order revenue">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={analytics.monthly}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EA580C" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#EA580C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => formatINR(v)} />
                <Area type="monotone" dataKey="revenue" stroke="#EA580C" fill="url(#revGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartPanel>
          <ChartPanel title="Savings forecast" subtitle="Member savings delivered">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={analytics.monthly}>
                <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip formatter={(v: number) => formatINR(v)} />
                <Line type="monotone" dataKey="savings" stroke="#16A34A" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartPanel>
        </div>

        <ChartPanel title="Weekly activity" subtitle="Orders & savings this week" className="animate-slide-up stagger-2">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={analytics.weeklySavings ?? analytics.weekly}>
              <XAxis dataKey="day" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="orders" fill="#EA580C" radius={[4, 4, 0, 0]} name="Orders" />
              <Bar dataKey="savings" fill="#16A34A" radius={[4, 4, 0, 0]} name="Savings" />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>

        {activity && (
          <div className="grid lg:grid-cols-2 gap-6 animate-slide-up stagger-3">
            <ActivityPanel title="Recently viewed" items={activity.recentlyViewedProducts.map((id) => getProductById(id)?.name ?? id).slice(0, 6)} empty="Browse products to build history" />
            <ActivityPanel title="Recent searches" items={activity.searchHistory.map((s) => s.query).slice(0, 6)} empty="Search deals to see history" />
            <ActivityPanel title="Stores visited" items={activity.recentlyViewedStores.map((id) => getStoreById(id)?.name ?? id).slice(0, 6)} empty="Explore stores on the map" />
            <ActivityPanel title="Favorite categories" items={activity.favoriteCategories} empty="View products to track categories" />
          </div>
        )}

        <div className="animate-slide-up stagger-3">
          <h3 className="text-xl font-medium flex items-center gap-2 mb-4"><Award className="size-5 text-accent" /> Achievements</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((a) => (
              <div key={a.id} className={`p-4 rounded-2xl ring-1 ${a.unlockedAt ? "ring-accent/40 bg-accent/5" : "ring-border bg-card"} shadow-card`}>
                <div className="text-2xl">{a.icon}</div>
                <div className="font-medium mt-2">{a.title}</div>
                <div className="text-xs text-muted-foreground mt-1">{a.description}</div>
                <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-accent transition-all" style={{ width: `${(a.progress / a.target) * 100}%` }} />
                </div>
                <div className="text-[10px] text-muted-foreground mt-1">{a.progress}/{a.target}{a.unlockedAt ? " · Unlocked" : ""}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="animate-slide-up stagger-3">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h3 className="text-xl font-medium tracking-tight">Recommended for you</h3>
              <p className="text-sm text-muted-foreground mt-1">Based on deal score and your browsing patterns</p>
            </div>
            <Link to="/products" className="text-sm text-accent font-medium hover:underline">View all</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map((p) => <DealCard key={p.id} product={p} />)}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 animate-slide-up stagger-4">
          <div className="bg-card ring-1 ring-border rounded-2xl p-6 shadow-card">
            <h3 className="font-medium flex items-center gap-2"><Sparkles className="size-4 text-accent" /> Quick Actions</h3>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                { to: "/ai-planner", label: "AI Planner" },
                { to: "/deal-map", label: "Deal Map" },
                { to: "/compare", label: "Compare" },
                { to: "/orders", label: "My Orders" },
                { to: "/cart", label: "View Cart" },
                { to: "/favorites", label: "Wishlist" },
              ].map((a) => (
                <Link key={a.to} to={a.to} className="p-4 bg-muted/80 rounded-xl text-sm font-medium hover:ring-1 hover:ring-accent/40 transition-all">
                  {a.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="bg-primary text-primary-foreground rounded-2xl p-6 shadow-card">
            <h3 className="font-medium flex items-center gap-2"><TrendingUp className="size-4 text-accent" /> Savings goal</h3>
            <div className="mt-2 text-3xl font-semibold tracking-tight">{formatINR(saved)} <span className="text-sm text-white/60">/ {formatINR(25000)}</span></div>
            <div className="mt-4 h-2.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-accent transition-all duration-500" style={{ width: `${Math.min(100, (saved / 25000) * 100)}%` }} />
            </div>
            <p className="text-sm text-white/60 mt-4">You're {Math.round((saved / 25000) * 100)}% toward your monthly target.</p>
            {user?.role === "admin" && (
              <Link to="/admin" className="mt-4 inline-flex px-4 py-2 bg-accent text-accent-foreground rounded-lg text-sm font-medium">Admin Dashboard →</Link>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function ChartPanel({ title, subtitle, children, className }: { title: string; subtitle?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-card ring-1 ring-border rounded-2xl p-6 shadow-card ${className ?? ""}`}>
      <div className="mb-4">
        <h3 className="font-medium">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function ActivityPanel({ title, items, empty }: { title: string; items: string[]; empty: string }) {
  return (
    <div className="bg-card ring-1 ring-border rounded-2xl p-5 shadow-card">
      <h4 className="text-sm font-semibold flex items-center gap-2"><Eye className="size-4 text-muted-foreground" /> {title}</h4>
      {items.length === 0 ? (
        <p className="text-xs text-muted-foreground mt-3">{empty}</p>
      ) : (
        <ul className="mt-3 space-y-2 text-sm">
          {items.map((item, i) => (
            <li key={i} className="truncate text-secondary">{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
