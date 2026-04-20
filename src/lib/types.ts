export type MatchConfidence = "high" | "medium" | "low";

export interface MatchRow {
  id: string;
  confidence: number;
  level: MatchConfidence;
  official: { name: string; thumb: string };
  suspect: { name: string; source: string; thumb: string };
  detectedAt: string;
}
