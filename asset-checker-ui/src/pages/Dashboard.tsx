import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/fortress/AppShell";
import { Widget } from "@/components/fortress/Widget";
import { Sparkline } from "@/components/fortress/Sparkline";
import { Heatmap } from "@/components/fortress/Heatmap";
import { Gauge } from "@/components/fortress/Gauge";
import { FeedTable } from "@/components/fortress/FeedTable";
import { DetailPanel } from "@/components/fortress/DetailPanel";
import { LiveScanFeed } from "@/components/fortress/LiveScanFeed";
import { fetchReports } from "@/lib/api";
import { mapReportToMatchRow } from "@/lib/reportMapper";
import type { MatchConfidence, MatchRow } from "@/lib/types";
import { ArrowUpRight, ArrowDownRight, ShieldCheck, Flame, ScanLine } from "lucide-react";
import { toast } from "sonner";

export default function Dashboard() {
  const [rows, setRows] = useState<MatchRow[]>([]);
  const [selected, setSelected] = useState<MatchRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [huntUrl, setHuntUrl] = useState("");
  const [isHunting, setIsHunting] = useState(false);
  const [huntSource, setHuntSource] = useState<string | null>(null);
  const [liveFeed, setLiveFeed] = useState<string[]>([]);
  const [baselineIds, setBaselineIds] = useState<Set<string>>(new Set());

  async function loadReports(options?: { showLoading?: boolean }) {
    const shouldShowLoading = options?.showLoading ?? false;
    if (shouldShowLoading) {
      setIsLoading(true);
    }
    const response = await fetchReports();
    const nextRows = response.reports.map(mapReportToMatchRow);
    setRows(nextRows);
    setSelected((current) => {
      if (!current) return nextRows[0] ?? null;
      return nextRows.find((item) => item.id === current.id) ?? nextRows[0] ?? null;
    });
    if (shouldShowLoading) {
      setIsLoading(false);
    }
    return nextRows;
  }

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setIsLoading(true);
        const response = await fetchReports();
        if (!isMounted) return;
        const nextRows = response.reports.map(mapReportToMatchRow);
        setRows(nextRows);
        setSelected(nextRows[0] ?? null);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isHunting) return;

    const poller = window.setInterval(async () => {
      try {
        const nextRows = await loadReports();
        const previews = nextRows
          .filter((row) => !baselineIds.has(row.id))
          .map((row) => row.suspect.thumb)
          .filter(Boolean);
        setLiveFeed((current) => {
          const merged = [...current, ...previews.filter((url) => !current.includes(url))];
          return merged.slice(-16);
        });
      } catch {
        // Keep polling silently while scan is active.
      }
    }, 2000);

    return () => window.clearInterval(poller);
  }, [baselineIds, isHunting]);

  async function handleStartDeepScan() {
    const value = huntUrl.trim();
    if (!value) {
      toast.error("Paste a URL before starting deep scan.");
      return;
    }

    setIsHunting(true);
    setHuntSource(value);
    setLiveFeed([]);
    setBaselineIds(new Set(rows.map((row) => row.id)));

    try {
      const url = "http://127.0.0.1:8080/api/auto-scan-url";
      console.log("[Dashboard URL Hunter] request:start", { url, method: "POST", targetUrl: value });
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: value }),
      });
      if (!response.ok) {
        const body = await response.text();
        console.error("[Dashboard URL Hunter] request:error", {
          url,
          status: response.status,
          statusText: response.statusText,
          body,
        });
        throw new Error(body || `Request failed (${response.status})`);
      }
      const result = (await response.json()) as { matches_found: number; scanned: number };
      console.log("[Dashboard URL Hunter] request:success", result);
      await loadReports();

      if (result.matches_found > 0) {
        toast.error(`High-priority alert: ${result.matches_found} potential match(es) found.`, {
          duration: 7000,
        });
        window.dispatchEvent(new CustomEvent("reports:refresh"));
      } else {
        toast.success(`Deep scan complete. ${result.scanned} image(s) processed.`);
      }
    } catch (error) {
      console.error("[Dashboard URL Hunter] request:exception", error);
      const message = error instanceof Error ? error.message : "Deep scan failed.";
      toast.error(message);
    } finally {
      setIsHunting(false);
    }
  }

  const confidenceCounts = useMemo<Record<MatchConfidence, number>>(
    () => ({
      high: rows.filter((item) => item.level === "high").length,
      medium: rows.filter((item) => item.level === "medium").length,
      low: rows.filter((item) => item.level === "low").length,
    }),
    [rows]
  );

  const trendData = useMemo(() => {
    const sorted = [...rows].reverse();
    const values = sorted.map((row) => row.confidence);
    if (values.length === 0) return [0];
    return values.slice(-14);
  }, [rows]);

  const heatmap = useMemo(() => {
    const normalized = rows.map((row) => Math.min(row.confidence / 100, 1));
    const source = normalized.length > 0 ? normalized : [0];
    return Array.from({ length: 7 }, (_, dayIdx) =>
      Array.from({ length: 24 }, (_, hourIdx) => source[(dayIdx * 24 + hourIdx) % source.length])
    );
  }, [rows]);

  const totalMatches = confidenceCounts.high + confidenceCounts.medium + confidenceCounts.low;

  return (
    <AppShell>
      <div className="h-screen overflow-y-auto">
        {/* Top bar */}
        <header className="flex items-center justify-between px-8 py-5 border-b border-hairline">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Operations Console</p>
            <h1 className="font-display text-3xl text-foreground leading-tight mt-0.5">
              Asset Integrity Dashboard
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="font-mono">17 Apr 2025 · 14:42 UTC</span>
            <span className="h-3 w-px bg-hairline" />
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-forest" /> Systems nominal
            </span>
          </div>
        </header>

        {/* Top summary — grouped mini-dashboards */}
        <section className="px-8 pt-6 pb-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Group 1 — Protected Assets */}
          <Widget
            label="Protected Assets"
            actions={<ShieldCheck className="h-3.5 w-3.5 text-forest" strokeWidth={1.6} />}
          >
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-display text-4xl font-medium text-foreground tabular leading-none">{rows.length}</p>
                <p className="text-[11px] text-muted-foreground mt-1.5 inline-flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3 text-forest" /> Live from reports API
                </p>
              </div>
              <div className="h-16 w-[60%]">
                <Sparkline data={trendData} />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-hairline grid grid-cols-3 gap-2 text-[10px] uppercase tracking-wider">
              <Mini label="Images" value={String(rows.length)} />
              <Mini label="Videos" value="--" />
              <Mini label="Logos" value="--" />
            </div>
          </Widget>

          {/* Group 2 — Risk Profile */}
          <Widget
            label="Risk Profile"
            hint="Last 7 days · Hourly intensity"
            actions={<Flame className="h-3.5 w-3.5 text-terracotta" strokeWidth={1.6} />}
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="space-y-1.5">
                <RiskRow color="terracotta" label="High" value={confidenceCounts.high} />
                <RiskRow color="copper" label="Medium" value={confidenceCounts.medium} />
                <RiskRow color="forest" label="Low" value={confidenceCounts.low} />
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Critical Alerts</p>
                <p className="font-display text-3xl font-medium text-terracotta tabular leading-none mt-1">
                  {confidenceCounts.high}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1 tabular">of {totalMatches} total</p>
              </div>
            </div>
            <Heatmap data={heatmap} />
          </Widget>

          {/* Group 3 — Scan Operations */}
          <Widget
            label="Scan Operations"
            hint="Today vs 30-day average"
            actions={<ScanLine className="h-3.5 w-3.5 text-copper" strokeWidth={1.6} />}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-display text-4xl font-medium text-foreground tabular leading-none">{rows.length}</p>
                <p className="text-[11px] text-muted-foreground mt-1.5 inline-flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3 text-forest" /> Updated from server
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] uppercase tracking-wider">
                  <Mini label="Queued" value={isLoading ? "Scanning..." : "0"} />
                  <Mini label="Failed" value="0" tone="terracotta" />
                </div>
              </div>
              <Gauge value={totalMatches > 0 ? Math.round((confidenceCounts.high / totalMatches) * 100) : 0} />
            </div>
            <div className="mt-3 pt-3 border-t border-hairline flex items-center justify-between text-[10px] text-muted-foreground">
              <span className="uppercase tracking-wider">Throughput</span>
              <span className="font-mono inline-flex items-center gap-1 text-foreground">
                <ArrowDownRight className="h-3 w-3 text-terracotta" /> API backed
              </span>
            </div>
          </Widget>

          <Widget
            label="Active URL Hunt"
            hint="Paste a source page URL and launch deep scan."
            actions={<ScanLine className="h-3.5 w-3.5 text-copper" strokeWidth={1.6} />}
          >
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="url"
                  value={huntUrl}
                  onChange={(event) => setHuntUrl(event.target.value)}
                  placeholder="https://example.com/gallery"
                  className="flex-1 rounded-md border border-hairline bg-panel-raised px-3 py-2 text-[12px] text-foreground placeholder:text-muted-foreground"
                />
                <button
                  type="button"
                  onClick={handleStartDeepScan}
                  disabled={isHunting}
                  className="rounded-md brushed-copper px-3 py-2 text-[12px] font-medium text-[hsl(38_75%_88%)] ring-1 ring-[hsl(22_70%_55%/0.45)] disabled:opacity-60"
                >
                  {isHunting ? "Scanning..." : "Start Deep Scan"}
                </button>
              </div>
              <LiveScanFeed items={liveFeed} activeUrl={huntSource} isScanning={isHunting} />
            </div>
          </Widget>
        </section>

        {/* Center: feed + right rail detail panel */}
        <section className="px-8 pb-8 grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4">
          {isLoading ? (
            <div className="panel rounded-md p-6 text-sm text-muted-foreground">Scanning...</div>
          ) : (
            <FeedTable rows={rows} selectedId={selected?.id ?? null} onSelect={setSelected} />
          )}
          <DetailPanel row={selected} onClose={() => setSelected(null)} />
        </section>
      </div>
    </AppShell>
  );
}

function Mini({ label, value, tone }: { label: string; value: string; tone?: "terracotta" }) {
  return (
    <div>
      <p className="text-muted-foreground/80">{label}</p>
      <p className={`font-data text-sm tabular mt-0.5 ${tone === "terracotta" ? "text-terracotta" : "text-foreground"}`}>
        {value}
      </p>
    </div>
  );
}

function RiskRow({
  color,
  label,
  value,
}: {
  color: "terracotta" | "copper" | "forest";
  label: string;
  value: number;
}) {
  const map = {
    terracotta: "bg-terracotta",
    copper: "bg-copper",
    forest: "bg-forest",
  } as const;
  return (
    <div className="flex items-center gap-2">
      <span className={`h-1.5 w-1.5 rounded-full ${map[color]}`} />
      <span className="text-[11px] text-muted-foreground w-14">{label}</span>
      <span className="font-data text-[13px] tabular text-foreground">{value}</span>
    </div>
  );
}
