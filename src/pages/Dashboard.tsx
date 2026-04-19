import { useState } from "react";
import { AppShell } from "@/components/fortress/AppShell";
import { Widget } from "@/components/fortress/Widget";
import { Sparkline } from "@/components/fortress/Sparkline";
import { Heatmap } from "@/components/fortress/Heatmap";
import { Gauge } from "@/components/fortress/Gauge";
import { FeedTable } from "@/components/fortress/FeedTable";
import { DetailPanel } from "@/components/fortress/DetailPanel";
import { matchRows, confidenceCounts, trendData, heatmap } from "@/lib/mockData";
import type { MatchRow } from "@/lib/types";
import { ArrowUpRight, ArrowDownRight, ShieldCheck, Flame, ScanLine } from "lucide-react";

export default function Dashboard() {
  const [selected, setSelected] = useState<MatchRow | null>(matchRows[0]);

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
        <section className="px-8 pt-6 pb-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Group 1 — Protected Assets */}
          <Widget
            label="Protected Assets"
            actions={<ShieldCheck className="h-3.5 w-3.5 text-forest" strokeWidth={1.6} />}
          >
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-display text-4xl font-medium text-foreground tabular leading-none">1,284</p>
                <p className="text-[11px] text-muted-foreground mt-1.5 inline-flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3 text-forest" /> +24 this week
                </p>
              </div>
              <div className="h-16 w-[60%]">
                <Sparkline data={trendData} />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-hairline grid grid-cols-3 gap-2 text-[10px] uppercase tracking-wider">
              <Mini label="Images" value="912" />
              <Mini label="Videos" value="218" />
              <Mini label="Logos" value="154" />
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
                <p className="font-display text-4xl font-medium text-foreground tabular leading-none">8,412</p>
                <p className="text-[11px] text-muted-foreground mt-1.5 inline-flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3 text-forest" /> +18% vs avg
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] uppercase tracking-wider">
                  <Mini label="Queued" value="412" />
                  <Mini label="Failed" value="3" tone="terracotta" />
                </div>
              </div>
              <Gauge value={84} />
            </div>
            <div className="mt-3 pt-3 border-t border-hairline flex items-center justify-between text-[10px] text-muted-foreground">
              <span className="uppercase tracking-wider">Throughput</span>
              <span className="font-mono inline-flex items-center gap-1 text-foreground">
                <ArrowDownRight className="h-3 w-3 text-terracotta" /> 1.2s avg latency
              </span>
            </div>
          </Widget>
        </section>

        {/* Center: feed + right rail detail panel */}
        <section className="px-8 pb-8 grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4">
          <FeedTable rows={matchRows} selectedId={selected?.id ?? null} onSelect={setSelected} />
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
