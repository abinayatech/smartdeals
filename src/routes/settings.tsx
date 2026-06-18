import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FloatingNav } from "@/components/layout/FloatingNav";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";
import { getSettings, updateSettings, applyTheme, type UserSettings } from "@/lib/settings-service";
import { requireAuth } from "@/lib/route-guard";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings · Smart Deal" }] }),
  beforeLoad: () => requireAuth("/settings"),
  component: SettingsPage,
});

function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>(getSettings());
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const save = (section: keyof UserSettings, updates: Partial<UserSettings[keyof UserSettings]>) => {
    const updated = updateSettings(section, updates);
    setSettings(updated);
    if (section === "appearance" && "theme" in updates) applyTheme(updates.theme as UserSettings["appearance"]["theme"]);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const sections = [
    { key: "account" as const, title: "Account", desc: "Email, phone, profile photo." },
    { key: "security" as const, title: "Security", desc: "Password, login alerts, two-factor authentication." },
    { key: "notifications" as const, title: "Notifications", desc: "Price drops, AI suggestions, order updates." },
    { key: "appearance" as const, title: "Appearance", desc: "Light, dark, and reduced motion." },
    { key: "privacy" as const, title: "Privacy", desc: "Data sharing, location access, ad personalization." },
  ];

  return (
    <div className="min-h-screen bg-background">
      <FloatingNav />
      <PageHeader eyebrow="Settings" title="App settings" subtitle="Control your Smart Deal experience." breadcrumbs={[{ label: "Settings" }]} />
      {saved && <div className="max-w-3xl mx-auto px-6 -mt-4 mb-4"><div className="p-3 bg-savings/10 text-savings rounded-xl text-sm text-center">Settings saved locally.</div></div>}
      <section className="px-6 pb-24">
        <div className="max-w-3xl mx-auto space-y-3">
          {sections.map((s) => (
            <div key={s.key} className="bg-card ring-1 ring-border rounded-2xl overflow-hidden">
              <div className="p-5 flex items-center justify-between gap-4">
                <div>
                  <div className="font-medium">{s.title}</div>
                  <div className="text-sm text-muted-foreground">{s.desc}</div>
                </div>
                <button onClick={() => setActiveSection(activeSection === s.key ? null : s.key)} className="px-4 py-2 text-sm font-medium ring-1 ring-border rounded-lg hover:ring-accent/40">
                  {activeSection === s.key ? "Close" : "Manage"}
                </button>
              </div>
              {activeSection === s.key && (
                <div className="px-5 pb-5 border-t border-border pt-4 space-y-3">
                  {s.key === "account" && (
                    <>
                      <Toggle label="Email notifications" checked={settings.account.emailNotifications} onChange={(v) => save("account", { emailNotifications: v })} />
                      <Toggle label="SMS alerts" checked={settings.account.smsAlerts} onChange={(v) => save("account", { smsAlerts: v })} />
                      <div>
                        <label className="text-sm text-muted-foreground">Language</label>
                        <select value={settings.account.language} onChange={(e) => save("account", { language: e.target.value })} className="mt-1 w-full bg-muted rounded-lg px-3 py-2 text-sm">
                          <option value="en">English</option><option value="hi">Hindi</option><option value="mr">Marathi</option>
                        </select>
                      </div>
                    </>
                  )}
                  {s.key === "security" && (
                    <>
                      <Toggle label="Two-factor authentication" checked={settings.security.twoFactor} onChange={(v) => save("security", { twoFactor: v })} />
                      <Toggle label="Login alerts" checked={settings.security.loginAlerts} onChange={(v) => save("security", { loginAlerts: v })} />
                      <div>
                        <label className="text-sm text-muted-foreground">Session timeout (minutes)</label>
                        <input type="number" value={settings.security.sessionTimeout} onChange={(e) => save("security", { sessionTimeout: parseInt(e.target.value) || 30 })} className="mt-1 w-full bg-muted rounded-lg px-3 py-2 text-sm" />
                      </div>
                    </>
                  )}
                  {s.key === "notifications" && (
                    <>
                      <Toggle label="Price drop alerts" checked={settings.notifications.priceDrops} onChange={(v) => save("notifications", { priceDrops: v })} />
                      <Toggle label="Order updates" checked={settings.notifications.orderUpdates} onChange={(v) => save("notifications", { orderUpdates: v })} />
                      <Toggle label="AI suggestions" checked={settings.notifications.aiSuggestions} onChange={(v) => save("notifications", { aiSuggestions: v })} />
                      <Toggle label="Deal alerts" checked={settings.notifications.deals} onChange={(v) => save("notifications", { deals: v })} />
                      <Toggle label="Marketing emails" checked={settings.notifications.marketing} onChange={(v) => save("notifications", { marketing: v })} />
                    </>
                  )}
                  {s.key === "appearance" && (
                    <>
                      <div>
                        <label className="text-sm text-muted-foreground">Theme</label>
                        <select value={settings.appearance.theme} onChange={(e) => save("appearance", { theme: e.target.value as UserSettings["appearance"]["theme"] })} className="mt-1 w-full bg-muted rounded-lg px-3 py-2 text-sm">
                          <option value="light">Light</option><option value="dark">Dark</option><option value="system">System</option>
                        </select>
                      </div>
                      <Toggle label="Reduced motion" checked={settings.appearance.reducedMotion} onChange={(v) => save("appearance", { reducedMotion: v })} />
                      <Toggle label="Compact mode" checked={settings.appearance.compactMode} onChange={(v) => save("appearance", { compactMode: v })} />
                    </>
                  )}
                  {s.key === "privacy" && (
                    <>
                      <Toggle label="Share usage data" checked={settings.privacy.shareData} onChange={(v) => save("privacy", { shareData: v })} />
                      <Toggle label="Location access" checked={settings.privacy.locationAccess} onChange={(v) => save("privacy", { locationAccess: v })} />
                      <Toggle label="Personalized ads" checked={settings.privacy.personalizedAds} onChange={(v) => save("privacy", { personalizedAds: v })} />
                      <Toggle label="Analytics" checked={settings.privacy.analytics} onChange={(v) => save("privacy", { analytics: v })} />
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between py-2 cursor-pointer">
      <span className="text-sm">{label}</span>
      <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className={`relative w-10 h-5 rounded-full transition-colors ${checked ? "bg-accent" : "bg-muted"}`}>
        <span className={`absolute top-0.5 size-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
      </button>
    </label>
  );
}
