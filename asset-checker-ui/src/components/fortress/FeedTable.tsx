import { ConfidenceBar } from "./ConfidenceBar";
import { ActionMenu } from "./ActionMenu";
import { ExternalLink } from "lucide-react";
import type { MatchRow, MatchConfidence } from "@/lib/types";

interface FeedTableProps {
  rows: MatchRow[];
  selectedId: string | null;
  onSelect: (row: MatchRow) => void;
}

const levelDot: Record<MatchConfidence, string> = {
  high: "bg-terracotta",
  medium: "bg-copper",
  low: "bg-forest",
};

const levelLabel: Record<MatchConfidence, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

export function FeedTable({ rows, selectedId, onSelect }: FeedTableProps) {
  return (
    <div className="panel rounded-md overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-hairline">
        <div>
          <h2 className="font-display text-lg text-foreground leading-tight">Match Results</h2>
          <p className="text-[11px] text-muted-foreground">Server-generated reports from official and suspect scan workflows.</p>
        </div>
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-terracotta opacity-60"></span>
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-terracotta"></span>
          </span>
          Live
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground/80">
              <th className="text-left font-medium px-5 py-2.5 border-b border-hairline">Confidence</th>
              <th className="text-left font-medium px-5 py-2.5 border-b border-hairline">Official Asset</th>
              <th className="text-left font-medium px-5 py-2.5 border-b border-hairline">Suspect Media</th>
              <th className="text-left font-medium px-5 py-2.5 border-b border-hairline">Detected</th>
              <th className="text-right font-medium px-5 py-2.5 border-b border-hairline">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const active = row.id === selectedId;
              return (
                <tr
                  key={row.id}
                  onClick={() => onSelect(row)}
                  className={`cursor-pointer transition-colors border-b border-hairline/60 last:border-0 ${
                    active ? "bg-accent/40" : "hover:bg-accent/25"
                  }`}
                >
                  <td className="px-5 py-3 align-middle">
                    <div className="flex items-center gap-2">
                      <span className={`h-1.5 w-1.5 rounded-full ${levelDot[row.level]} shrink-0`} />
                      <ConfidenceBar value={row.confidence} />
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground hidden xl:inline">
                        {levelLabel[row.level]}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 align-middle">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={row.official.thumb} alt="" className="h-9 w-9 rounded object-cover ring-1 ring-hairline shrink-0" />
                      <div className="min-w-0">
                        <p className="text-foreground truncate max-w-[200px]">{row.official.name}</p>
                        <p className="font-mono text-[10px] text-muted-foreground">{row.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 align-middle">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={row.suspect.thumb} alt="" className="h-9 w-9 rounded object-cover ring-1 ring-hairline shrink-0" />
                      <div className="min-w-0">
                        <p className="text-foreground truncate max-w-[220px]">{row.suspect.name}</p>
                        <a
                          href={row.suspect.url ?? "#"}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-[10px] text-copper hover:text-copper-bright truncate max-w-[220px]"
                        >
                          {row.suspect.source}
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 align-middle font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                    {row.detectedAt}
                  </td>
                  <td className="px-5 py-3 align-middle text-right">
                    <ActionMenu onAction={(a) => console.log(a, row.id)} />
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td className="px-5 py-6 text-muted-foreground" colSpan={5}>
                  No match reports found yet. Upload official assets, then scan suspect media.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
