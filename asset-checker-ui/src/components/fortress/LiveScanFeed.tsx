interface LiveScanFeedProps {
  items: string[];
  activeUrl: string | null;
  isScanning: boolean;
}

export function LiveScanFeed({ items, activeUrl, isScanning }: LiveScanFeedProps) {
  return (
    <div className="rounded-md border border-hairline bg-panel-raised/40">
      <div className="px-3 py-2 border-b border-hairline flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Live Scan Feed</p>
        {isScanning && (
          <span className="inline-flex items-center gap-1 text-[10px] text-copper">
            <span className="h-1.5 w-1.5 rounded-full bg-copper animate-pulse" />
            Scanning...
          </span>
        )}
      </div>

      {activeUrl && (
        <p className="px-3 pt-2 text-[11px] text-muted-foreground truncate" title={activeUrl}>
          Source: {activeUrl}
        </p>
      )}

      <div className="p-3 max-h-52 overflow-y-auto">
        {items.length === 0 ? (
          <p className="text-[11px] text-muted-foreground">Processed images will appear here one by one.</p>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {items.map((url) => (
              <div key={url} className="rounded border border-hairline overflow-hidden bg-background aspect-square">
                <img src={url} alt="Scanned item" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
