import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Bell, MapPin, Sparkles, TrendingDown, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { FloatingNav } from "@/components/layout/FloatingNav";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";
import { useAuth } from "@/lib/auth-context";
import { deleteNotification, getNotifications, markAllAsRead, markAsRead, timeAgo } from "@/lib/notifications-service";
import type { Notification } from "@/lib/mock-data";
import { requireAuth } from "@/lib/route-guard";

const ICONS: Record<Notification["type"], React.ReactNode> = {
  price_drop: <TrendingDown className="size-4 text-savings" />,
  order: <Bell className="size-4 text-primary" />,
  ai: <Sparkles className="size-4 text-warning" />,
  deal: <MapPin className="size-4 text-accent" />,
  system: <Bell className="size-4 text-secondary" />,
};

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications · Smart Deal" }] }),
  beforeLoad: () => requireAuth("/notifications"),
  component: NotifPage,
});

function NotifPage() {
  const { user } = useAuth();
  const [notifs, setNotifs] = useState<Notification[]>([]);

  useEffect(() => {
    if (user) setNotifs(getNotifications(user.id));
  }, [user]);

  const refresh = () => { if (user) setNotifs(getNotifications(user.id)); };

  return (
    <div className="min-h-screen bg-background">
      <FloatingNav />
      <PageHeader
        eyebrow="Inbox"
        title="Notifications"
        subtitle="Price drops, order updates and AI suggestions."
        breadcrumbs={[{ label: "Notifications" }]}
        actions={
          <div className="flex gap-2">
            <button onClick={() => { if (user) { markAllAsRead(user.id); refresh(); } }} className="px-3 py-1.5 text-sm ring-1 ring-border rounded-lg hover:ring-accent/40">Mark all read</button>
          </div>
        }
      />
      <section className="px-6 pb-24">
        <div className="max-w-3xl mx-auto space-y-3">
          {notifs.length === 0 && (
            <div className="text-center py-16 bg-card ring-1 ring-border rounded-2xl">
              <Bell className="size-8 mx-auto text-muted-foreground" />
              <p className="mt-3 text-muted-foreground">No notifications yet.</p>
            </div>
          )}
          {notifs.map((n) => (
            <div key={n.id} className={`bg-card ring-1 rounded-2xl p-5 flex items-start gap-4 ${n.read ? "ring-border opacity-70" : "ring-accent/30"}`}>
              <div className="size-10 rounded-lg bg-muted grid place-items-center shrink-0">{ICONS[n.type]}</div>
              <button onClick={() => { markAsRead(n.id); refresh(); }} className="flex-1 min-w-0 text-left">
                <div className="font-medium">{n.title}</div>
                <div className="text-sm text-muted-foreground mt-0.5">{n.body}</div>
              </button>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <div className="text-xs text-muted-foreground">{timeAgo(n.createdAt)}</div>
                <button onClick={() => { deleteNotification(n.id); refresh(); }} aria-label="Delete" className="text-muted-foreground hover:text-destructive"><Trash2 className="size-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
