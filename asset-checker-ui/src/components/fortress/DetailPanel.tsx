import { X, Hash, Calendar, Globe, Layers, Image as ImageIcon, Loader2 } from "lucide-react";
import type { MatchRow, MatchStatus } from "@/lib/types";
import { ConfidenceBar } from "./ConfidenceBar";

interface DetailPanelProps {
  row: MatchRow | null;
  onClose: () => void;
  onStatusUpdate: (matchId: string, newStatus: MatchStatus) => void;
}

export function DetailPanel({ row, onClose, onStatusUpdate }: DetailPanelProps) {
  if (!row) {
    return (
      <aside className="panel rounded-md p-6 flex flex-col items-center justify-center text-center min-h-[600px]">
        <div className="h-12 w-12 rounded-full border border-dashed border-hairline grid place-items-center mb-3">
          <Layers className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
        </div>
        <p className="font-display text-lg text-foreground">Match Inspector</p>
        <p className="text-[12px] text-muted-foreground max-w-[200px] mt-1">
          Select a match in the feed to view side-by-side comparison and metadata.
        </p>
      </aside>
    );
  }

  const isPending = row.status === "pending";
  const isUpdating = row.statusUpdating === true;

  return (
    <aside className="panel rounded-md flex flex-col animate-fade-in overflow-hidden">
      {}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-hairline">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Match Inspector</p>
          <h3 className="font-display text-lg text-foreground leading-tight">{row.id}</h3>
        </div>
        <div className="flex items-center gap-2">
          {}
          {row.status !== "pending" && (
            <span
              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[9px] uppercase tracking-wider font-medium ${
                row.status === "false_positive"
                  ? "border-forest/30 bg-forest/10 text-forest"
                  : "border-terracotta/30 bg-terracotta/10 text-terracotta"
              }`}
            >
              {row.status === "false_positive" ? "False Positive" : "Escalated"}
            </span>
          )}
          <button
            onClick={onClose}
            className="h-7 w-7 rounded-md grid place-items-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {}
      <div className="p-4 grid grid-cols-2 gap-3">
        <ComparePane label="Official" name={row.official.name} thumb={row.official.thumb} accent="forest" />
        <ComparePane label="Suspect" name={row.suspect.name} thumb={row.suspect.thumb} accent="terracotta" />
      </div>

      {}
      <div className="px-5 pb-3">
        <div className="rounded-md border border-hairline bg-panel-raised/60 px-3 py-2.5">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
            <span>Match Confidence</span>
            <span className="text-copper-bright">{row.level.toUpperCase()}</span>
          </div>
          <ConfidenceBar value={row.confidence} />
        </div>
      </div>

      {}
      <div className="px-5 pb-4">
        <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2">
          Pixel Overlap Heatmap
        </p>
        <div className="relative aspect-[16/9] rounded-md overflow-hidden border border-hairline bg-panel-raised">
          <img src={row.official.thumb} alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" />
          <PixelHeatmap />
          <div className="absolute bottom-2 right-2 flex items-center gap-1.5 rounded bg-background/70 backdrop-blur px-2 py-1">
            <span className="h-2 w-6 rounded-full gradient-confidence" />
            <span className="text-[9px] font-mono text-muted-foreground">low → high</span>
          </div>
        </div>
      </div>

      {}
      <div className="px-5 pb-5">
        <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2">
          Metadata Comparison
        </p>
        <div className="rounded-md border border-hairline overflow-hidden">
          <MetaRow icon={Hash} label="Perceptual Hash" official="0x9F21A4C8…" suspect="0x9F21A4C2…" diff />
          <MetaRow icon={ImageIcon} label="Dimensions" official="2400 × 1600" suspect="2398 × 1602" diff />
          <MetaRow icon={Layers} label="Color Profile" official="sRGB" suspect="sRGB" />
          <MetaRow icon={Calendar} label="First Seen" official="2024-08-12" suspect="2025-04-17" diff />
          <MetaRow icon={Globe} label="Origin" official="Internal CMS" suspect={row.suspect.source} diff />
        </div>
      </div>

      {}
      <div className="mt-auto p-4 border-t border-hairline">
        {isUpdating ? (
          <div className="flex items-center justify-center gap-2 py-2 text-[12px] text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin text-copper" />
            Updating status…
          </div>
        ) : !isPending ? (
          <div className="rounded-md border border-hairline bg-panel-raised/60 px-3 py-2.5 text-center text-[12px] text-muted-foreground">
            This match has been resolved —{" "}
            <span className={row.status === "false_positive" ? "text-forest" : "text-terracotta"}>
              {row.status === "false_positive" ? "marked as False Positive" : "escalated for review"}
            </span>
            .
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onStatusUpdate(row.id, "false_positive")}
              className="rounded-md border border-hairline bg-panel-raised px-3 py-2 text-[12px] font-medium text-foreground hover:border-forest/50 hover:text-forest hover:bg-forest/5 transition-colors"
            >
              False Positive
            </button>
            <button
              onClick={() => onStatusUpdate(row.id, "escalated")}
              className="rounded-md brushed-copper px-3 py-2 text-[12px] font-medium text-[hsl(38_75%_88%)] ring-1 ring-[hsl(22_70%_55%/0.45)] hover:ring-[hsl(22_75%_60%/0.7)] transition-all"
            >
              Escalate Review
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}


function ComparePane({
  label,
  name,
  thumb,
  accent,
}: {
  label: string;
  name: string;
  thumb: string;
  accent: "forest" | "terracotta";
}) {
  const tone = accent === "forest" ? "text-forest" : "text-terracotta";
  return (
    <div className="rounded-md overflow-hidden border border-hairline bg-panel-raised/60">
      <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-hairline">
        <span className={`text-[9px] uppercase tracking-[0.18em] font-medium ${tone}`}>{label}</span>
      </div>
      <div className="aspect-square bg-background">
        <img src={thumb} alt={name} className="h-full w-full object-cover" />
      </div>
      <div className="px-2.5 py-1.5">
        <p className="text-[11px] text-foreground truncate">{name}</p>
      </div>
    </div>
  );
}

function MetaRow({
  icon: Icon,
  label,
  official,
  suspect,
  diff,
}: {
  icon: typeof Hash;
  label: string;
  official: string;
  suspect: string;
  diff?: boolean;
}) {
  return (
    <div className="grid grid-cols-[1fr_1fr_1fr] gap-2 items-center px-3 py-2 border-b border-hairline/70 last:border-0 bg-panel-raised/40">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <div className="font-mono text-[11px] text-foreground truncate">{official}</div>
      <div className={`font-mono text-[11px] truncate ${diff ? "text-terracotta" : "text-foreground"}`}>
        {suspect}
      </div>
    </div>
  );
}

function PixelHeatmap() {
  const blobs = Array.from({ length: 14 }).map((_, i) => ({
    cx: 8 + (i * 9) % 90 + Math.random() * 6,
    cy: 12 + (i * 13) % 70 + Math.random() * 8,
    r: 4 + Math.random() * 9,
    o: 0.3 + Math.random() * 0.55,
  }));
  return (
    <svg viewBox="0 0 100 56" className="absolute inset-0 h-full w-full mix-blend-screen" preserveAspectRatio="none">
      <defs>
        <radialGradient id="blob" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="hsl(38 80% 70%)" stopOpacity="0.9" />
          <stop offset="55%" stopColor="hsl(22 70% 55%)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="hsl(22 60% 45%)" stopOpacity="0" />
        </radialGradient>
      </defs>
      {blobs.map((b, i) => (
        <circle key={i} cx={b.cx} cy={b.cy} r={b.r} fill="url(#blob)" opacity={b.o} />
      ))}
    </svg>
  );
}
