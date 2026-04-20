interface HeatmapProps {
  data: number[][]; // rows x cols
}

const days = ["M", "T", "W", "T", "F", "S", "S"];

export function Heatmap({ data }: HeatmapProps) {
  return (
    <div className="flex gap-2 items-center">
      <div className="flex flex-col gap-[3px] text-[9px] text-muted-foreground/70 font-mono pr-1">
        {days.map((d, i) => (
          <div key={i} className="h-3 leading-3">{d}</div>
        ))}
      </div>
      <div className="flex-1 grid grid-rows-7 gap-[3px]">
        {data.map((row, i) => (
          <div key={i} className="grid grid-cols-24 gap-[3px]" style={{ gridTemplateColumns: "repeat(24, minmax(0, 1fr))" }}>
            {row.map((v, j) => (
              <div
                key={j}
                className="h-3 rounded-[2px]"
                style={{
                  background: `hsl(var(--copper) / ${0.08 + v * 0.85})`,
                }}
                title={`${["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i]} ${j}:00 — intensity ${(v * 100).toFixed(0)}%`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
