import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Column<T> = {
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  sortValue?: (row: T) => string | number;
};

type AdminDataTableProps<T> = {
  title: string;
  data: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string;
  onDelete?: (id: string) => void;
  deleteId?: (row: T) => string;
  viewLink?: (row: T) => string;
  pageSize?: number;
  searchKeys?: ((row: T) => string)[];
};

export function AdminDataTable<T>({
  title,
  data,
  columns,
  rowKey,
  onDelete,
  deleteId,
  viewLink,
  pageSize = 15,
  searchKeys,
}: AdminDataTableProps<T>) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const filtered = useMemo(() => {
    let rows = [...data];
    if (query.trim() && searchKeys) {
      const q = query.toLowerCase();
      rows = rows.filter((row) => searchKeys.some((fn) => fn(row).toLowerCase().includes(q)));
    }
    if (sortKey) {
      const col = columns.find((c) => c.key === sortKey);
      if (col?.sortValue) {
        rows.sort((a, b) => {
          const av = col.sortValue!(a);
          const bv = col.sortValue!(b);
          const cmp = av < bv ? -1 : av > bv ? 1 : 0;
          return sortDir === "asc" ? cmp : -cmp;
        });
      }
    }
    return rows;
  }, [data, query, searchKeys, sortKey, sortDir, columns]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);

  const toggleSort = (key: string, col: Column<T>) => {
    if (!col.sortValue) return;
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div className="bg-card ring-1 ring-border rounded-2xl overflow-hidden shadow-card">
      <div className="p-4 border-b flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="font-medium">{title}</div>
          <div className="text-xs text-muted-foreground">{filtered.length} records</div>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(0); }}
            placeholder="Search…"
            className="pl-9"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`text-left p-3 font-medium ${col.sortValue ? "cursor-pointer hover:text-accent" : ""}`}
                  onClick={() => toggleSort(col.key, col)}
                >
                  {col.header}
                  {sortKey === col.key && (sortDir === "asc" ? " ↑" : " ↓")}
                </th>
              ))}
              {(onDelete || viewLink) && <th className="p-3 w-20" />}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="p-8 text-center text-muted-foreground">
                  No results match your search.
                </td>
              </tr>
            ) : (
              paged.map((row) => {
                const id = rowKey(row);
                return (
                  <tr key={id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    {columns.map((col) => (
                      <td key={col.key} className="p-3 max-w-55 truncate">
                        {viewLink && col.key === columns[0].key ? (
                          <a href={viewLink(row)} className="text-accent hover:underline">{col.cell(row)}</a>
                        ) : (
                          col.cell(row)
                        )}
                      </td>
                    ))}
                    {(onDelete || viewLink) && (
                      <td className="p-3">
                        {onDelete && deleteId && (
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => onDelete(deleteId(row))}>
                            <Trash2 className="size-4" />
                          </Button>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="p-3 border-t flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Page {page + 1} of {totalPages}</span>
          <div className="flex gap-1">
            <Button variant="outline" size="icon" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
              <ChevronLeft className="size-4" />
            </Button>
            <Button variant="outline" size="icon" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
