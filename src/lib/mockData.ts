import type { MatchConfidence, MatchRow } from "./types";

const grad = (a: string, b: string, label: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><defs><linearGradient id='g' x1='0' x2='1' y1='0' y2='1'><stop offset='0' stop-color='${a}'/><stop offset='1' stop-color='${b}'/></linearGradient></defs><rect width='200' height='200' fill='url(#g)'/><text x='50%' y='52%' font-family='Georgia, serif' font-size='22' fill='rgba(255,240,210,0.9)' text-anchor='middle' font-style='italic'>${label}</text></svg>`
  )}`;

export const matchRows: MatchRow[] = [
  {
    id: "MTR-9F21",
    confidence: 97.4,
    level: "high",
    official: { name: "F1 Team Logo — Primary", thumb: grad("#B76E2F", "#1A1410", "F1") },
    suspect: { name: "FanEdit F1 logo (alt color)", source: "fanforum.com/threads/8821", thumb: grad("#D67E5A", "#2A2018", "FE") },
    detectedAt: "2025-04-17 14:22 UTC",
  },
  {
    id: "MTR-9F20",
    confidence: 92.1,
    level: "high",
    official: { name: "Maison Cuvée — Bottle Render", thumb: grad("#8a4a1f", "#1A1410", "MC") },
    suspect: { name: "knockoff_bottle_v3.jpg", source: "marketplace.example/listing/4421", thumb: grad("#a85a2a", "#2A2018", "KB") },
    detectedAt: "2025-04-17 13:48 UTC",
  },
  {
    id: "MTR-9F1F",
    confidence: 81.7,
    level: "medium",
    official: { name: "Heritage Crest 1898", thumb: grad("#5a8a4a", "#1A1410", "HC") },
    suspect: { name: "vintage_emblem_remix.png", source: "design.example/share/77b", thumb: grad("#7aaa5a", "#2A2018", "VE") },
    detectedAt: "2025-04-17 12:11 UTC",
  },
  {
    id: "MTR-9F1E",
    confidence: 73.2,
    level: "medium",
    official: { name: "Atelier Print Pattern 04", thumb: grad("#B76E2F", "#2A2018", "AP") },
    suspect: { name: "scarf_pattern_lookalike.webp", source: "shop.example/p/scarves/2210", thumb: grad("#c98050", "#1A1410", "SP") },
    detectedAt: "2025-04-17 10:55 UTC",
  },
  {
    id: "MTR-9F1D",
    confidence: 58.9,
    level: "medium",
    official: { name: "Editorial Cover — Spring", thumb: grad("#7a5a3a", "#1A1410", "EC") },
    suspect: { name: "blog_cover_homage.jpg", source: "blog.example/posts/inspiration", thumb: grad("#9a7a5a", "#2A2018", "BC") },
    detectedAt: "2025-04-17 09:31 UTC",
  },
  {
    id: "MTR-9F1C",
    confidence: 41.3,
    level: "low",
    official: { name: "Studio Mark — Monogram", thumb: grad("#3a5a4a", "#1A1410", "SM") },
    suspect: { name: "monogram_inspo.png", source: "moodboard.example/pin/991", thumb: grad("#5a7a6a", "#2A2018", "MI") },
    detectedAt: "2025-04-17 08:02 UTC",
  },
  {
    id: "MTR-9F1B",
    confidence: 28.5,
    level: "low",
    official: { name: "Packaging Sleeve — A2", thumb: grad("#5a3a2a", "#1A1410", "PS") },
    suspect: { name: "stock_packaging_77.jpg", source: "stock.example/photo/4421", thumb: grad("#7a5a4a", "#2A2018", "ST") },
    detectedAt: "2025-04-16 22:14 UTC",
  },
];

export const confidenceCounts: Record<MatchConfidence, number> = {
  high: matchRows.filter((m) => m.level === "high").length + 12,
  medium: matchRows.filter((m) => m.level === "medium").length + 18,
  low: matchRows.filter((m) => m.level === "low").length + 7,
};

export const trendData = [12, 18, 14, 22, 19, 28, 31, 26, 34, 30, 38, 42, 39, 47];

// 7 days x 24 hours, normalized 0-1
export const heatmap: number[][] = Array.from({ length: 7 }).map(() =>
  Array.from({ length: 24 }).map(() => Math.pow(Math.random(), 1.6))
);
