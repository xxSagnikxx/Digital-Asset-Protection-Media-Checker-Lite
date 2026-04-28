import { useState } from "react";
import { toast } from "sonner";
import { Shield, Loader2, Globe, Search } from "lucide-react";
import { AppShell } from "@/components/fortress/AppShell";

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8080';

export default function SearchInterface() {
  const [status, setStatus] = useState<"idle" | "scanning">("idle");
  const [url, setUrl] = useState("");
  const [log, setLog] = useState<string[]>([]);

  async function handleUrlHunt() {
    if (!url) return toast.error("Enter a target URL first");
    setStatus("scanning");
    setLog(["Initializing surveillance engine...", `Targeting: ${url}`, "Fetching remote assets..."]);

    try {
      const res = await fetch(`${API_BASE}/api/auto-scan-url`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ url })
      });
      const data = await res.json();
      
      setLog(prev => [...prev, `Found ${data.scanned_count} images.`, `Detected ${data.matches_found} violations.`]);
      
      if (data.matches_found > 0) {
        toast.error(`ALERT: ${data.matches_found} Unauthorized Assets Found`, { description: "Check reports for details." });
      } else {
        toast.success("Scan complete. Site is clean.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Scan failed. Backend unreachable.");
    } finally {
      setStatus("idle");
    }
  }

  async function handleFileScan(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus("scanning");
    setLog(["Analyzing local file fingerprint...", "Checking global asset registry..."]);

    const fd = new FormData();
    fd.append('image', file);

    try {
      const res = await fetch(`${API_BASE}/api/scan-suspect`, { 
        method: 'POST', 
        headers: {
          'ngrok-skip-browser-warning': 'true'
        },
        body: fd 
      });
      const data = await res.json();
      if (data.match_found) {
        toast.error(`MATCH DETECTED: ${data.asset_name} (${data.score}%)`);
      } else {
        toast.success("No match found.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Scan failed.");
    } finally {
      setStatus("idle");
    }
  }

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto mt-10 p-8 space-y-8">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-blue-500" />
          <h1 className="text-2xl font-bold">Active Surveillance Hunt</h1>
        </div>

        <div className="panel p-6 space-y-4 rounded-xl border border-hairline bg-panel">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Target URL Scraper</h2>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="https://suspect-sports-site.com/gallery" 
              className="flex-1 bg-black/20 border border-hairline rounded px-4 py-2 text-sm"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button 
              onClick={handleUrlHunt}
              disabled={status === "scanning"}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded text-sm font-bold flex items-center gap-2"
            >
              {status === "scanning" ? <Loader2 className="animate-spin w-4 h-4" /> : <Search className="w-4 h-4" />}
              HUNT
            </button>
          </div>
        </div>

        <div className="panel p-6 space-y-4 rounded-xl border border-hairline bg-panel relative">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Manual File Analysis</h2>
          <input type="file" onChange={handleFileScan} className="absolute inset-0 opacity-0 cursor-pointer" />
          <div className="border-2 border-dashed border-white/10 rounded-lg p-10 text-center">
            <Globe className="w-10 h-10 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Drop suspect image here to scan registry</p>
          </div>
        </div>

        {status === "scanning" && (
          <div className="bg-black/40 p-4 rounded-lg font-mono text-xs text-blue-400 border border-blue-500/20">
            {log.map((l, i) => <div key={i} className="mb-1">{`> ${l}`}</div>)}
          </div>
        )}
      </div>
    </AppShell>
  );
}