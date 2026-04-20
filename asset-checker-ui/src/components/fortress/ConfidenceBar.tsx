export function ConfidenceBar({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="flex items-center gap-2.5 min-w-[140px]">
      <div className="relative h-[5px] flex-1 overflow-hidden rounded-full bg-[hsl(var(--hairline))]">
        <div
          className="absolute inset-y-0 left-0 rounded-full gradient-confidence shadow-[0_0_8px_-1px_hsl(var(--copper-bright)/0.5)]"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="font-data text-[11px] font-medium tabular-nums text-foreground w-10 text-right">
        {pct.toFixed(1)}
      </span>
    </div>
  );
}
