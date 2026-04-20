import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/fortress/AppShell";

export default function SuspectMediaUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(0);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      if (!file) {
        toast.error("Select suspect media before scanning.");
        return;
      }

      setIsScanning(true);
      const form = new FormData();
      form.append("image", file, file.name);

      const url = "http://127.0.0.1:8080/api/scan-suspect";
      console.log("[SuspectMediaUpload] request:start", { url, method: "POST", fileName: file.name });
      const response = await fetch(url, {
        method: "POST",
        body: form,
      });
      if (!response.ok) {
        const body = await response.text();
        console.error("[SuspectMediaUpload] request:error", {
          url,
          status: response.status,
          statusText: response.statusText,
          body,
        });
        throw new Error(body || `Request failed (${response.status})`);
      }
      const data = await response.json();
      console.log("[SuspectMediaUpload] request:success", data);
      toast.success("Suspect media scan completed.");
      setFile(null);
      setFileInputKey((prev) => prev + 1);
    } catch (error) {
      console.error("[SuspectMediaUpload] request:exception", error);
      const message = error instanceof Error ? error.message : "Scan failed.";
      toast.error(message);
    } finally {
      setIsScanning(false);
    }
  }

  return (
    <AppShell>
      <div className="h-screen overflow-y-auto">
        <header className="px-8 py-5 border-b border-hairline">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Upload</p>
          <h1 className="font-display text-3xl text-foreground leading-tight mt-0.5">Suspect Media</h1>
        </header>
        <div className="p-8">
          <form onSubmit={onSubmit} className="panel rounded-md p-6 max-w-xl space-y-4">
            <label className="block text-sm text-foreground">
              Suspect File
              <input
                key={fileInputKey}
                type="file"
                accept="image/*"
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                className="mt-1 w-full rounded-md border border-hairline bg-panel-raised px-3 py-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-copper file:px-2 file:py-1 file:text-xs file:text-white"
              />
            </label>
            <p className="text-xs text-muted-foreground">{file ? `Selected: ${file.name}` : "No file selected."}</p>
            <button
              type="submit"
              disabled={isScanning}
              className="rounded-md brushed-copper px-4 py-2 text-sm font-medium text-[hsl(38_75%_88%)] ring-1 ring-[hsl(22_70%_55%/0.45)] disabled:opacity-60"
            >
              {isScanning ? "Scanning..." : "Run Suspect Scan"}
            </button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
