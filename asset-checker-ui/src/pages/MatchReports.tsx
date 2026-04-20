import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/fortress/AppShell";
import { FeedTable } from "@/components/fortress/FeedTable";
import { DetailPanel } from "@/components/fortress/DetailPanel";
import { fetchReports } from "@/lib/api";
import { mapReportToMatchRow } from "@/lib/reportMapper";
import type { MatchRow } from "@/lib/types";

export default function MatchReports() {
  const [rows, setRows] = useState<MatchRow[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        const message = loadError instanceof Error ? loadError.message : "Failed to load reports.";
        setError(message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadReports();

    const handleRefresh = () => {
      void loadReports();
    };
    window.addEventListener("reports:refresh", handleRefresh);

    return () => {
      isMounted = false;
      window.removeEventListener("reports:refresh", handleRefresh);
    };
  }, []);

  const selectedRow = useMemo(
    () => rows.find((row) => row.id === selectedId) ?? null,
    [rows, selectedId]
  );

  return (
    <AppShell>
      <div className="h-screen overflow-y-auto">
        <header className="px-8 py-5 border-b border-hairline">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Reports</p>
          <h1 className="font-display text-3xl text-foreground leading-tight mt-0.5">Match Reports</h1>
        </header>

        <section className="px-8 py-6 grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4">
          {isLoading ? (
            <div className="panel rounded-md p-6 text-sm text-muted-foreground">Scanning...</div>
          ) : error ? (
            <div className="panel rounded-md p-6 text-sm text-terracotta">{error}</div>
          ) : (
            <>
              <FeedTable rows={rows} selectedId={selectedId} onSelect={(row) => setSelectedId(row.id)} />
              <DetailPanel row={selectedRow} onClose={() => setSelectedId(null)} />
            </>
          )}
        </section>
      </div>
    </AppShell>
  );
}
