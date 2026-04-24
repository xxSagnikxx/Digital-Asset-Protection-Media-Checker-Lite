import type { MatchConfidence, MatchRow } from "@/lib/types";
import type { ReportItem } from "@/lib/api";

function toConfidenceLevel(score: number): MatchConfidence {
  if (score >= 85) return "high";
  if (score >= 60) return "medium";
  return "low";
}

function formatDetectedAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toISOString().replace("T", " ").slice(0, 16) + " UTC";
}

function normalizeSource(url: string): string {
  try {
    const parsed = new URL(url);
    return `${parsed.host}${parsed.pathname}`;
  } catch {
    return url || "unknown-source";
  }
}

export function mapReportToMatchRow(report: ReportItem): MatchRow {
  const confidence = Number(report.similarity_score.toFixed(1));
  return {
    id: String(report.id),
    confidence,
    level: toConfidenceLevel(confidence),
    status: "pending",
    official: {
      name: report.official_assets?.name ?? "Unknown Official Asset",
      thumb: report.official_assets?.public_url ?? "/placeholder.svg",
    },
    suspect: {
      name: report.suspect_filename || "Uploaded Suspect Media",
      source: normalizeSource(report.suspect_url),
      url: report.suspect_url,
      thumb: report.suspect_url || "/placeholder.svg",
    },
    detectedAt: formatDetectedAt(report.created_at),
  };
}
