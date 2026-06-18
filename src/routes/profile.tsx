import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { FloatingNav } from "@/components/layout/FloatingNav";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";
import { useAuth } from "@/lib/auth-context";
import { updateAccount } from "@/lib/auth-service";
import { addAddress, deleteAddress, getAddresses, saveAddresses, type Address } from "@/lib/settings-service";
import { requireAuth } from "@/lib/route-guard";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile · Smart Deal" }] }),
  beforeLoad: () => requireAuth("/profile"),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, signOut, updateUser } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>(getAddresses());
  const [form, setForm] = useState({ fullName: user?.fullName ?? "", mobile: user?.mobile ?? "", email: user?.email ?? "" });
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [avatar, setAvatar] = useState(user?.avatar ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [addrForm, setAddrForm] = useState({ label: "", line1: "", city: "Mumbai", pincode: "" });

  const saveProfile = () => {
    if (!user) return;
    updateAccount(user.id, { fullName: form.fullName, mobile: form.mobile, avatar });
    updateUser({ fullName: form.fullName, mobile: form.mobile, avatar });
    setEditing(false);
    setMessage("Profile updated successfully.");
  };

  const changePassword = () => {
    if (!user) return;
    if (pwForm.newPw !== pwForm.confirm) { setMessage("Passwords do not match."); return; }
    if (pwForm.newPw.length < 8) { setMessage("Password must be at least 8 characters."); return; }
    updateAccount(user.id, { password: pwForm.newPw });
    setChangingPw(false);
    setPwForm({ current: "", newPw: "", confirm: "" });
    setMessage("Password changed successfully.");
  };

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { setAvatar(reader.result as string); setMessage("Avatar uploaded. Save profile to apply."); };
    reader.readAsDataURL(file);
  };

  const addNewAddress = () => {
    addAddress({ ...addrForm, isDefault: addresses.length === 0 });
    setAddresses(getAddresses());
    setShowAddrForm(false);
    setAddrForm({ label: "", line1: "", city: "Mumbai", pincode: "" });
    setMessage("Address added.");
  };

  return (
    <div className="min-h-screen bg-background">
      <FloatingNav />
      <PageHeader eyebrow="Account" title="Your profile" subtitle="Manage personal details, addresses and preferences." breadcrumbs={[{ label: "Profile" }]} />
      <section className="px-6 pb-24">
        {message && <div className="max-w-4xl mx-auto mb-4 p-3 bg-savings/10 text-savings rounded-xl text-sm">{message}</div>}
        <div className="max-w-4xl mx-auto grid md:grid-cols-[240px_1fr] gap-8">
          <div className="bg-card ring-1 ring-border rounded-2xl p-6 text-center h-fit">
            <div className="size-20 rounded-full bg-accent text-accent-foreground grid place-items-center text-2xl font-semibold mx-auto overflow-hidden">
              {avatar ? <img src={avatar} alt="" className="w-full h-full object-cover" /> : (user?.fullName.charAt(0).toUpperCase() ?? "U")}
            </div>
            <label className="mt-3 inline-block text-xs text-accent cursor-pointer hover:underline">
              Upload Avatar
              <input type="file" accept="image/*" onChange={handleAvatar} className="sr-only" />
            </label>
            <div className="mt-2 font-medium">{user?.fullName ?? "Guest"}</div>
            <div className="text-xs text-muted-foreground">{user?.email ?? "—"}</div>
            <div className="text-[10px] text-accent uppercase font-bold mt-1">{user?.role}</div>
            <button onClick={() => { signOut(); navigate({ to: "/" }); }} className="mt-5 w-full py-2 text-sm font-medium text-destructive ring-1 ring-destructive/30 rounded-lg hover:bg-destructive/5">Logout</button>
          </div>
          <div className="space-y-4">
            <Card title="Personal Details" action={<button onClick={() => setEditing(!editing)} className="text-xs text-accent font-medium">{editing ? "Cancel" : "Edit"}</button>}>
              {editing ? (
                <div className="space-y-3">
                  <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="w-full bg-muted rounded-lg px-3 py-2 text-sm" placeholder="Full Name" />
                  <input value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} className="w-full bg-muted rounded-lg px-3 py-2 text-sm" placeholder="Mobile" />
                  <button onClick={saveProfile} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm">Save</button>
                </div>
              ) : (
                <>
                  <Row label="Full Name" value={user?.fullName ?? "—"} />
                  <Row label="Email" value={user?.email ?? "—"} />
                  <Row label="Mobile" value={user?.mobile ?? "—"} />
                </>
              )}
            </Card>
            <Card title="Security" action={<button onClick={() => setChangingPw(!changingPw)} className="text-xs text-accent font-medium">{changingPw ? "Cancel" : "Change Password"}</button>}>
              {changingPw ? (
                <div className="space-y-3">
                  <input type="password" value={pwForm.current} onChange={(e) => setPwForm({ ...pwForm, current: e.target.value })} className="w-full bg-muted rounded-lg px-3 py-2 text-sm" placeholder="Current Password" />
                  <input type="password" value={pwForm.newPw} onChange={(e) => setPwForm({ ...pwForm, newPw: e.target.value })} className="w-full bg-muted rounded-lg px-3 py-2 text-sm" placeholder="New Password" />
                  <input type="password" value={pwForm.confirm} onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })} className="w-full bg-muted rounded-lg px-3 py-2 text-sm" placeholder="Confirm Password" />
                  <button onClick={changePassword} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm">Update Password</button>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Password last changed: Never (demo mode)</p>
              )}
            </Card>
            <Card title="Saved Addresses" action={<button onClick={() => setShowAddrForm(!showAddrForm)} className="text-xs text-accent font-medium">+ Add</button>}>
              {showAddrForm && (
                <div className="mb-4 space-y-2">
                  <input value={addrForm.label} onChange={(e) => setAddrForm({ ...addrForm, label: e.target.value })} className="w-full bg-muted rounded-lg px-3 py-2 text-sm" placeholder="Label (Home, Office)" />
                  <input value={addrForm.line1} onChange={(e) => setAddrForm({ ...addrForm, line1: e.target.value })} className="w-full bg-muted rounded-lg px-3 py-2 text-sm" placeholder="Address" />
                  <input value={addrForm.pincode} onChange={(e) => setAddrForm({ ...addrForm, pincode: e.target.value })} className="w-full bg-muted rounded-lg px-3 py-2 text-sm" placeholder="Pincode" />
                  <button onClick={addNewAddress} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm">Save Address</button>
                </div>
              )}
              {addresses.map((a) => (
                <div key={a.id} className="flex justify-between items-start py-2 border-b border-border last:border-0">
                  <div>
                    <div className="font-medium text-sm">{a.label} {a.isDefault && <span className="text-[10px] text-accent">(Default)</span>}</div>
                    <div className="text-xs text-muted-foreground">{a.line1}, {a.city} {a.pincode}</div>
                  </div>
                  <button onClick={() => { deleteAddress(a.id); setAddresses(getAddresses()); }} className="text-xs text-destructive">Remove</button>
                </div>
              ))}
            </Card>
            <Link to="/settings" className="block text-center py-3 ring-1 ring-border rounded-xl text-sm font-medium hover:ring-accent/40">Go to Settings →</Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

function Card({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="bg-card ring-1 ring-border rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary">{title}</h3>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-sm py-1">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-right">{value}</dd>
    </div>
  );
}
