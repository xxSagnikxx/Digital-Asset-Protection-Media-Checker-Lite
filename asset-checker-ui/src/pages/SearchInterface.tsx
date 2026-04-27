import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Shield, Loader2, Globe } from "lucide-react";

export default function SearchInterface() {
  const [status, setStatus] = useState<"idle" | "scanning">("idle");
  const [log, setLog] = useState<string[]>([]);

  const mockUrls = [
    "Scanning: twitter.com/sports/media...",
    "Scanning: instagram.com/explore/tags...",
    "Analyzing: gettyimages.com/archive...",
    "Querying: espn.com/players/photos...",
    "Matching visual fingerprints against Node-72..."
  ];

  async function handleScan(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus("scanning");
    setLog([]);
    mockUrls.forEach((msg, i) => {
      setTimeout(() => setLog(prev => [...prev, msg]), i * 600);
    });

    const fd = new FormData();
    fd.append('image', file);

    try {
      const res = await fetch('http://127.0.0.1:8080/api/scan', { method: 'POST', body: fd });
      const data = await res.json();

      if (data.match) {
        setTimeout(() => {
          toast.error(`MATCH DETECTED: Found in Global Registry (${data.score}% confidence)`, {
            description: `Original Asset ID: ${data.asset_name}`,
            duration: 10000
          });
          setStatus("idle");
        }, 3500);
      } else {
        setTimeout(() => {
          toast.success("Scan complete. No unauthorized copies found.");
          setStatus("idle");
        }, 3500);
      }
    } catch {
      toast.error("Network error.");
      setStatus("idle");
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 border border-white/10 bg-black/40 rounded-xl backdrop-blur-md">
      <div className="flex items-center gap-3 mb-6">
        <Globe className={`w-5 h-5 ${status === 'scanning' ? 'animate-spin text-blue-400' : 'text-gray-400'}`} />
        <h2 className="text-xl font-semibold">Global Asset Surveillance</h2>
      </div>

      <div className="relative group border-2 border-dashed border-white/20 rounded-lg p-12 transition-colors hover:border-blue-500/50">
        <input 
          type="file" 
          onChange={handleScan} 
          className="absolute inset-0 opacity-0 cursor-pointer" 
          disabled={status === 'scanning'}
        />
        <div className="text-center">
          {status === 'idle' ? (
            <>
              <Shield className="w-12 h-12 mx-auto mb-4 text-gray-500" />
              <p className="text-sm text-gray-400">Upload suspect image to begin automated hunt</p>
            </>
          ) : (
            <div className="space-y-3">
              <Loader2 className="w-8 h-8 mx-auto animate-spin text-blue-500" />
              <div className="text-left bg-black/60 p-4 rounded font-mono text-[10px] text-blue-300 h-32 overflow-hidden">
                {log.map((line, i) => <div key={i} className="mb-1 opacity-80">{line}</div>)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}