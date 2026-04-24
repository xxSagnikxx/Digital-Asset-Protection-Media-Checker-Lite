import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AppShell } from "@/components/fortress/AppShell";
import { FeedTable } from "@/components/fortress/FeedTable";
import { DetailPanel } from "@/components/fortress/DetailPanel";
import { fetchReports, updateMatchStatus } from "@/lib/api";
import { mapReportToMatchRow } from "@/lib/reportMapper";
import type { MatchRow, MatchStatus } from "@/lib/types";
import { CheckCircle2, AlertTriangle } from "lucide-react";

interface Toast {
  id: string;
  type: "success" | "error";
  message: string;
}

type ViewMode = "pending" | "all";

export default function MatchReports() {
  const [rows, setRows] = useState<MatchRow[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("pending");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const pushToast = useCallback((type: Toast["type"], message: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    const timer = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      toastTimers.current.delete(id);
    }, 3500);
    toastTimers.current.set(id, timer);
  }, []);

  useEffect(() => {
    return () => {
      
      toastTimers.current.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadReports() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetchReports();
        if (!isMounted) return;
        const nextRows = response.reports.map(mapReportToMatchRow);
        setRows(nextRows);
        setSelectedId(nextRows[0]?.id ?? null);
      } catch (loadError) {
        if (!isMounted) return;
        const message =
          loadError instanceof Error ? loadError.message : "Failed to load reports.";
        setError(message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadReports();

    const handleRefresh = () => void loadReports();
    window.addEventListener("reports:refresh", handleRefresh);

    return () => {
      isMounted = false;
      window.removeEventListener("reports:refresh", handleRefresh);
    };
  }, []);

  const handleStatusUpdate = useCallback(
    async (matchId: string, newStatus: MatchStatus) => {
      
      setRows((prev) =>
        prev.map((r) => (r.id === matchId ? { ...r, statusUpdating: true } : r))
      );

      try {
        await updateMatchStatus(matchId, newStatus);

        
        setRows((prev) =>
          prev.map((r) =>
            r.id === matchId ? { ...r, status: newStatus, statusUpdating: false } : r
          )
        );

        
        setSelectedId((prev) => {
          if (prev === matchId && viewMode === "pending") return null;
          return prev;
        });

        const label = newStatus === "false_positive" ? "False Positive" : "Escalated";
        pushToast("success", `Match #${matchId} marked as ${label}.`);
      } catch (err) {
        
        setRows((prev) =>
          prev.map((r) => (r.id === matchId ? { ...r, statusUpdating: false } : r))
        );
        const message = err instanceof Error ? err.message : "Status update failed.";
        pushToast("error", message);
      }
    },
    [viewMode, pushToast]
  );

  const displayRows = useMemo(
    () => (viewMode === "pending" ? rows.filter((r) => r.status === "pending") : rows),
    [rows, viewMode]
  );

  const selectedRow = useMemo(
    () => rows.find((r) => r.id === selectedId) ?? null,
    [rows, selectedId]
  );

  const pendingCount = useMemo(() => rows.filter((r) => r.status === "pending").length, [rows]);
  const totalCount = rows.length;

  return (
    <AppShell>
      <div className="h-screen overflow-y-auto">
        {}
        <header className="px-8 py-5 border-b border-hairline flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Reports</p>
            <h1 className="font-display text-3xl text-foreground leading-tight mt-0.5">
              Match Reports
            </h1>
          </div>

          {}
          {!isLoading && !error && (
            <div className="flex items-center gap-1 rounded-md border border-hairline bg-panel-raised p-1 mb-0.5">
              <TabPill
                label="Pending"
                count={pendingCount}
                active={viewMode === "pending"}
                onClick={() => setViewMode("pending")}
              />
              <TabPill
                label="All Reports"
                count={totalCount}
                active={viewMode === "all"}
                onClick={() => setViewMode("all")}
              />
            </div>
          )}
        </header>

        <section className="px-8 py-6 grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4">
          {isLoading ? (
            <LoadingState />
          ) : error ? (
            <div className="panel rounded-md p-6 text-sm text-terracotta">{error}</div>
          ) : (
            <>
              <FeedTable
                rows={displayRows}
                selectedId={selectedId}
                onSelect={(row) => setSelectedId(row.id)}
                onStatusUpdate={handleStatusUpdate}
              />
              <DetailPanel
                row={selectedRow}
                onClose={() => setSelectedId(null)}
                onStatusUpdate={handleStatusUpdate}
              />
            </>
          )}
        </section>
      </div>

      {}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <ToastNotification key={t.id} toast={t} />
        ))}
      </div>
    </AppShell>
  );
}


function TabPill({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider transition-colors ${
        active
          ? "bg-copper/20 text-copper border border-copper/30"
          : "text-muted-foreground hover:text-foreground hover:bg-accent/30 border border-transparent"
      }`}
    >
      {label}
      <span
        className={`rounded-full px-1.5 py-0.5 text-[9px] font-mono ${
          active ? "bg-copper/30 text-copper" : "bg-accent/60 text-muted-foreground"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function LoadingState() {
  return (
    <div className="panel rounded-md p-8 flex flex-col items-center justify-center gap-3 min-h-[240px]">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-2 w-2 rounded-full bg-copper/60 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      <p className="text-[12px] text-muted-foreground">Fetching match reports…</p>
    </div>
  );
}

function ToastNotification({ toast }: { toast: Toast }) {
  const isSuccess = toast.type === "success";
  return (
    <div
      className={`pointer-events-auto flex items-center gap-3 rounded-md border px-4 py-3 text-[12px] shadow-[var(--shadow-elevated)] animate-fade-in backdrop-blur-sm ${
        isSuccess
          ? "border-forest/30 bg-forest/10 text-forest"
          : "border-terracotta/30 bg-terracotta/10 text-terracotta"
      }`}
    >
      {isSuccess ? (
        <CheckCircle2 className="h-4 w-4 shrink-0" />
      ) : (
        <AlertTriangle className="h-4 w-4 shrink-0" />
      )}
      <span>{toast.message}</span>
    </div>
  );
}
