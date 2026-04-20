interface SparklineProps {
  data: number[];
  height?: number;
  stroke?: string;
  fill?: string;
}

export function Sparkline({
  data,
  height = 56,
  stroke = "hsl(var(--copper-bright))",
  fill = "hsl(var(--copper) / 0.18)",
}: SparklineProps) {
  const w = 240;
  const h = height;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = w / (data.length - 1);
  const pts = data.map((v, i) => [i * step, h - ((v - min) / range) * (h - 8) - 4] as const);
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const area = `${d} L${w},${h} L0,${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="spark-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={fill} />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#spark-fill)" />
      <path d={d} fill="none" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      {pts.slice(-1).map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={2.5} fill={stroke} />
      ))}
    </svg>
  );
}
