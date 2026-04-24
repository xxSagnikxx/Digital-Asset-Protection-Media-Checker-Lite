export const API_BASE_URL = "http://127.0.0.1:8080";

export interface OfficialAssetPayload {
  name: string;
  image: File;
}

export interface ScanSuspectPayload {
  image: File;
}

export interface ReportItem {
  id: string;
  suspect_filename: string;
  suspect_url: string;
  suspect_phash: string;
  similarity_score: number;
  created_at: string;
  official_assets: {
    id: string;
    name: string;
    public_url: string;
    phash: string;
  } | null;
}

export interface ReportsResponse {
  total: number;
  reports: ReportItem[];
}

export interface AutoScanUrlPayload {
  url: string;
}

export interface AutoScanUrlResponse {
  target_url: string;
  images_found: number;
  scanned: number;
  skipped: number;
  matches_found: number;
  matches: unknown[];
  scan_errors?: Array<{ url: string; reason: string }>;
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const method = init?.method ?? "GET";
  console.log("[api] request:start", { method, url, init });
  try {
    const response = await fetch(url, init);
    if (!response.ok) {
      const body = await response.text();
      console.error("[api] request:error", {
        method,
        url,
        status: response.status,
        statusText: response.statusText,
        body,
      });
      throw new Error(body || `Request failed (${response.status})`);
    }
    const data = (await response.json()) as T;
    console.log("[api] request:success", { method, url, status: response.status, data });
    return data;
  } catch (error) {
    console.error("[api] request:exception", { method, url, error });
    throw error;
  }
}

export async function verifyOfficialAsset(payload: OfficialAssetPayload): Promise<unknown> {
  const form = new FormData();
  form.append("name", payload.name);
  form.append("image", payload.image, payload.image.name);
  return request(`${API_BASE_URL}/api/verify-official`, {
    method: "POST",
    body: form,
  });
}

export async function scanSuspectMedia(payload: ScanSuspectPayload): Promise<unknown> {
  const form = new FormData();
  form.append("image", payload.image, payload.image.name);
  return request(`${API_BASE_URL}/api/scan-suspect`, {
    method: "POST",
    body: form,
  });
}

export async function fetchReports(): Promise<ReportsResponse> {
  return request<ReportsResponse>(`${API_BASE_URL}/api/reports`);
}

export async function autoScanUrl(payload: AutoScanUrlPayload): Promise<AutoScanUrlResponse> {
  return request<AutoScanUrlResponse>(`${API_BASE_URL}/api/auto-scan-url`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export async function updateMatchStatus(matchId: string, status: string): Promise<unknown> {
  return request(`${API_BASE_URL}/api/matches/${matchId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });
}
