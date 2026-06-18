import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Database, Download, RefreshCw } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { DB_TABLES, exportTableJson, getTableData, getDatabaseMeta, type DbTableName } from "@/services/database-service";
import { requireAdmin } from "@/lib/route-guard";

export const Route = createFileRoute("/admin/database")({
  head: () => ({ meta: [{ title: "Database Viewer · Smart Deal Admin" }] }),
  beforeLoad: () => requireAdmin(),
  component: AdminDatabasePage,
});

function AdminDatabasePage() {
  const [table, setTable] = useState<DbTableName>("products");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const pageSize = 15;

  const meta = useMemo(() => getDatabaseMeta(), [refreshKey]);
  const rows = useMemo(() => {
    const data = getTableData(table) as Record<string, unknown>[];
    if (!search) return data;
    const q = search.toLowerCase();
    return data.filter((row) => JSON.stringify(row).toLowerCase().includes(q));
  }, [table, search, refreshKey]);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const paged = rows.slice((page - 1) * pageSize, page * pageSize);
  const [selected, setSelected] = useState<unknown | null>(null);

  const download = () => {
    const blob = new Blob([exportTableJson(table)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `smartdeal-${table}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppShell
      header={{
        eyebrow: "Admin",
        title: "Database Viewer",
        subtitle: "Inspect simulated tables persisted in localStorage",
        breadcrumbs: [{ label: "Admin", to: "/admin" }, { label: "Database" }],
        actions: (
          <Link to="/admin" className="text-sm text-accent font-medium hover:underline">← Admin panel</Link>
        ),
      }}
      wide
    >
      <div className="max-w-7xl mx-auto space-y-6 animate-slide-up">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {meta.tables.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => { setTable(t.id); setPage(1); setSelected(null); }}
              className={`text-left p-4 rounded-xl ring-1 transition-all ${table === t.id ? "ring-accent bg-accent/5" : "ring-border bg-card hover:ring-accent/30"}`}
            >
              <div className="font-medium text-sm">{t.label}</div>
              <div className="text-2xl font-semibold mt-1">{t.count.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground mt-1">{t.description}</div>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <Database className="size-5 text-accent" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search records…"
            className="flex-1 min-w-[200px] bg-card ring-1 ring-border rounded-xl px-4 py-2 text-sm"
          />
          <Button variant="outline" size="sm" onClick={() => setRefreshKey((k) => k + 1)}><RefreshCw className="size-4 mr-1" /> Refresh</Button>
          <Button variant="outline" size="sm" onClick={download}><Download className="size-4 mr-1" /> Export JSON</Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-card ring-1 ring-border rounded-2xl overflow-hidden shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left">
                  <tr>
                    <th className="p-3 font-medium">#</th>
                    <th className="p-3 font-medium">Preview</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((row, i) => (
                    <tr key={i} className="border-t border-border hover:bg-muted/30 cursor-pointer" onClick={() => setSelected(row)}>
                      <td className="p-3 text-muted-foreground">{(page - 1) * pageSize + i + 1}</td>
                      <td className="p-3 font-mono text-xs truncate max-w-md">{JSON.stringify(row).slice(0, 120)}…</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between p-3 border-t text-xs">
              <span>{rows.length} records</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</Button>
                <span className="py-2">{page}/{totalPages}</span>
                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
              </div>
            </div>
          </div>
          <div className="bg-card ring-1 ring-border rounded-2xl p-4 shadow-card">
            <h3 className="font-medium mb-3">JSON Viewer</h3>
            <pre className="text-xs overflow-auto max-h-[480px] bg-muted/50 rounded-xl p-4 font-mono">
              {selected ? JSON.stringify(selected, null, 2) : "Select a row to inspect full JSON"}
            </pre>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">Storage prefix: <code>{meta.prefix}</code> · {meta.userIds.length} user namespaces · {DB_TABLES.length} tables</p>
      </div>
    </AppShell>
  );
}
