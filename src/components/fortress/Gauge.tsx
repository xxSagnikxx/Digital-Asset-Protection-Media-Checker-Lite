interface GaugeProps {
  value: number; // 0-100
  size?: number;
}

export function Gauge({ value, size = 90 }: GaugeProps) {
  const r = 36;
  const c = 2 * Math.PI * r;
  const dash = (value / 100) * c * 0.75;
  const gap = c - dash;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-[135deg]">
        <circle
          cx="50" cy="50" r={r}
          fill="none"
          stroke="hsl(var(--hairline))"
          strokeWidth={6}
          strokeDasharray={`${c * 0.75} ${c}`}
          strokeLinecap="round"
        />
        <circle
          cx="50" cy="50" r={r}
          fill="none"
          stroke="url(#gauge-grad)"
          strokeWidth={6}
          strokeDasharray={`${dash} ${gap + c}`}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="gauge-grad" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="hsl(var(--copper-deep))" />
            <stop offset="60%" stopColor="hsl(var(--copper-bright))" />
            <stop offset="100%" stopColor="hsl(var(--gold))" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <span className="font-data text-base font-semibold tracking-tight text-foreground">
          {value}%
        </span>
      </div>
    </div>
  );
}
