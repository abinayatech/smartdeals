import { createFileRoute, Link } from "@tanstack/react-router";
import { BarChart3, Bell, Package, ShoppingBag, Store, Tag, Users } from "lucide-react";
import { useState } from "react";
import { Area, AreaChart, Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AppShell } from "@/components/layout/AppShell";
import { StatCard } from "@/components/common/StatCard";
import { AdminDataTable } from "@/components/common/AdminDataTable";
import {
  getAdminProducts, getAdminStores, getAdminCategories, getAdminDeals,
  getAdminUsers, getAdminOrders, getAdminNotifications, getAnalytics,
  adminDeleteProduct, adminDeleteStore, adminDeleteCategory, adminDeleteDeal,
  adminDeleteNotification, adminUpdateOrderStatus,
} from "@/lib/admin-service";
import { formatINR } from "@/lib/mock-data";
import { requireAdmin } from "@/lib/route-guard";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Dashboard · Smart Deal" }] }),
  beforeLoad: () => requireAdmin(),
  component: AdminPage,
});

type Tab = "analytics" | "products" | "stores" | "categories" | "deals" | "users" | "orders" | "notifications";

function AdminPage() {
  const [tab, setTab] = useState<Tab>("analytics");
  const [, bump] = useState(0);
  const refresh = () => bump((n) => n + 1);
  const analytics = getAnalytics();
  const products = getAdminProducts();
  const stores = getAdminStores();
  const categories = getAdminCategories();
  const deals = getAdminDeals();
  const users = getAdminUsers();
  const orders = getAdminOrders();
  const notifications = getAdminNotifications();

  const tabs: { id: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: "analytics", label: "Analytics", icon: <BarChart3 className="size-4" /> },
    { id: "products", label: "Products", icon: <Package className="size-4" />, count: products.length },
    { id: "stores", label: "Stores", icon: <Store className="size-4" />, count: stores.length },
    { id: "categories", label: "Categories", icon: <Tag className="size-4" />, count: categories.length },
    { id: "deals", label: "Deals", icon: <Tag className="size-4" />, count: deals.length },
    { id: "users", label: "Users", icon: <Users className="size-4" />, count: users.length },
    { id: "orders", label: "Orders", icon: <ShoppingBag className="size-4" />, count: orders.length },
    { id: "notifications", label: "Notifications", icon: <Bell className="size-4" />, count: notifications.length },
  ];

  return (
    <AppShell
      header={{
        eyebrow: "Admin",
        title: "Admin Dashboard",
        subtitle: "Manage catalog, users, orders and platform analytics.",
        breadcrumbs: [{ label: "Admin" }],
        actions: (
          <Link to="/admin/database" className="text-sm font-medium text-accent hover:underline">Database Viewer →</Link>
        ),
      }}
    >
      <div className="flex flex-wrap gap-2 mb-8">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === t.id ? "bg-primary text-primary-foreground shadow-sm" : "bg-card ring-1 ring-border hover:ring-accent/40"}`}
          >
            {t.icon} {t.label} {t.count !== undefined && <span className="text-[10px] opacity-70">({t.count})</span>}
          </button>
        ))}
      </div>

      {tab === "analytics" && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Users" value={String(analytics.totalUsers)} />
            <StatCard label="Total Orders" value={String(analytics.totalOrders)} />
            <StatCard label="Total Revenue" value={formatINR(analytics.totalRevenue)} />
            <StatCard label="Total Savings" value={formatINR(analytics.totalSavings)} />
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            <Panel title="Weekly orders">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={analytics.weekly}>
                  <XAxis dataKey="day" fontSize={12} /><YAxis fontSize={12} /><Tooltip />
                  <Bar dataKey="orders" fill="#EA580C" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Panel>
            <Panel title="Monthly revenue">
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={analytics.monthly}>
                  <XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip formatter={(v: number) => formatINR(v)} />
                  <Area type="monotone" dataKey="revenue" stroke="#EA580C" fill="#EA580C33" />
                </AreaChart>
              </ResponsiveContainer>
            </Panel>
          </div>
          <Panel title="Savings trend">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={analytics.monthly}>
                <XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip formatter={(v: number) => formatINR(v)} />
                <Line type="monotone" dataKey="savings" stroke="#16A34A" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Panel>
          <div className="grid lg:grid-cols-2 gap-6">
            <Panel title="Top products">
              {analytics.topProducts.map((p, i) => (
                <div key={i} className="flex justify-between py-2 border-b border-border last:border-0 text-sm">
                  <span className="truncate flex-1">{p.name}</span>
                  <span className="font-medium ml-2">{formatINR(p.revenue)}</span>
                </div>
              ))}
            </Panel>
            <Panel title="Top stores">
              {analytics.topStores.map((s, i) => (
                <div key={i} className="flex justify-between py-2 border-b border-border last:border-0 text-sm">
                  <span>{s.name}</span>
                  <span className="font-medium">{formatINR(s.revenue)}</span>
                </div>
              ))}
            </Panel>
          </div>
        </div>
      )}

      {tab === "products" && (
        <AdminDataTable
          title="Products"
          data={products}
          rowKey={(p) => p.id}
          searchKeys={[(p) => p.name, (p) => p.store, (p) => p.category]}
          viewLink={(p) => `/product/${p.id}`}
          onDelete={(id) => { adminDeleteProduct(id); refresh(); }}
          deleteId={(p) => p.id}
          columns={[
            { key: "id", header: "ID", cell: (p) => p.id, sortValue: (p) => p.id },
            { key: "name", header: "Name", cell: (p) => p.name.slice(0, 40), sortValue: (p) => p.name },
            { key: "price", header: "Price", cell: (p) => formatINR(p.price), sortValue: (p) => p.price },
            { key: "store", header: "Store", cell: (p) => p.store, sortValue: (p) => p.store },
          ]}
        />
      )}

      {tab === "stores" && (
        <AdminDataTable
          title="Stores"
          data={stores}
          rowKey={(s) => s.id}
          searchKeys={[(s) => s.name, (s) => s.city]}
          viewLink={(s) => `/store/${s.id}`}
          onDelete={(id) => { adminDeleteStore(id); refresh(); }}
          deleteId={(s) => s.id}
          columns={[
            { key: "name", header: "Name", cell: (s) => s.name, sortValue: (s) => s.name },
            { key: "city", header: "City", cell: (s) => s.city },
            { key: "deals", header: "Deals", cell: (s) => String(s.dealCount), sortValue: (s) => s.dealCount },
            { key: "rating", header: "Rating", cell: (s) => String(s.rating), sortValue: (s) => s.rating },
          ]}
        />
      )}

      {tab === "categories" && (
        <AdminDataTable
          title="Categories"
          data={categories}
          rowKey={(c) => c.id}
          searchKeys={[(c) => c.name]}
          onDelete={(id) => { adminDeleteCategory(id); refresh(); }}
          deleteId={(c) => c.id}
          columns={[
            { key: "name", header: "Name", cell: (c) => c.name, sortValue: (c) => c.name },
            { key: "count", header: "Products", cell: (c) => String(c.count), sortValue: (c) => c.count },
          ]}
        />
      )}

      {tab === "deals" && (
        <AdminDataTable
          title="Deals"
          data={deals}
          rowKey={(d) => d.id}
          searchKeys={[(d) => d.title, (d) => d.type]}
          onDelete={(id) => { adminDeleteDeal(id); refresh(); }}
          deleteId={(d) => d.id}
          columns={[
            { key: "title", header: "Title", cell: (d) => d.title.slice(0, 45), sortValue: (d) => d.title },
            { key: "type", header: "Type", cell: (d) => d.type },
            { key: "discount", header: "Discount", cell: (d) => `${d.discount}%`, sortValue: (d) => d.discount },
          ]}
        />
      )}

      {tab === "users" && (
        <AdminDataTable
          title="Users"
          data={users}
          rowKey={(u) => u.id}
          searchKeys={[(u) => u.email, (u) => u.fullName]}
          columns={[
            { key: "email", header: "Email", cell: (u) => u.email, sortValue: (u) => u.email },
            { key: "name", header: "Name", cell: (u) => u.fullName, sortValue: (u) => u.fullName },
            { key: "role", header: "Role", cell: (u) => u.role },
            { key: "joined", header: "Joined", cell: (u) => new Date(u.joinedAt).toLocaleDateString("en-IN") },
          ]}
        />
      )}

      {tab === "orders" && (
        <AdminDataTable
          title="Orders"
          data={orders}
          rowKey={(o) => o.id}
          searchKeys={[(o) => o.id, (o) => o.store]}
          columns={[
            { key: "id", header: "Order", cell: (o) => <Link to="/order/$id" params={{ id: o.id }} className="text-accent hover:underline">{o.id}</Link>, sortValue: (o) => o.id },
            { key: "store", header: "Store", cell: (o) => o.store },
            { key: "total", header: "Total", cell: (o) => formatINR(o.total), sortValue: (o) => o.total },
            {
              key: "status",
              header: "Status",
              cell: (o) => (
                <select value={o.status} onChange={(e) => { adminUpdateOrderStatus(o.id, e.target.value as typeof o.status); refresh(); }} className="text-xs bg-muted rounded px-2 py-1">
                  {["Placed", "Confirmed", "Packed", "Shipped", "Out for Delivery", "Delivered", "Cancelled"].map((s) => <option key={s}>{s}</option>)}
                </select>
              ),
            },
          ]}
        />
      )}

      {tab === "notifications" && (
        <AdminDataTable
          title="Notifications"
          data={notifications}
          rowKey={(n) => n.id}
          searchKeys={[(n) => n.title, (n) => n.type]}
          onDelete={(id) => { adminDeleteNotification(id); refresh(); }}
          deleteId={(n) => n.id}
          columns={[
            { key: "title", header: "Title", cell: (n) => n.title.slice(0, 50), sortValue: (n) => n.title },
            { key: "type", header: "Type", cell: (n) => n.type },
            { key: "user", header: "User", cell: (n) => n.userId },
          ]}
        />
      )}
    </AppShell>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card ring-1 ring-border rounded-2xl p-6 shadow-card">
      <h3 className="font-medium mb-4">{title}</h3>
      {children}
    </div>
  );
}
