export type MatchConfidence = "high" | "medium" | "low";
export type MatchStatus = "pending" | "false_positive" | "escalated";

export interface MatchRow {
  id: string;
  confidence: number;
  level: MatchConfidence;
  status: MatchStatus;
  statusUpdating?: boolean;
  official: { name: string; thumb: string };
  suspect: { name: string; source: string; url?: string; thumb: string };
  detectedAt: string;
}
