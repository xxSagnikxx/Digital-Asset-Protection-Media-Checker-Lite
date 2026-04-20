import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface ActionMenuProps {
  onAction: (action: string) => void;
}

const actions = [
  { key: "review", label: "Review" },
  { key: "false_positive", label: "Mark False Positive" },
  { key: "archive", label: "Archive" },
  { key: "escalate", label: "Escalate to Counsel" },
];

export function ActionMenu({ onAction }: ActionMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className="inline-flex items-center gap-1 rounded border border-hairline bg-panel-raised px-2 py-1 text-[11px] text-foreground hover:border-copper/50 transition-colors"
      >
        Action
        <ChevronDown className="h-3 w-3 opacity-70" />
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-48 rounded-md border border-hairline bg-popover shadow-[var(--shadow-elevated)] z-20 overflow-hidden animate-fade-in">
          {actions.map((a) => (
            <button
              key={a.key}
              onClick={(e) => {
                e.stopPropagation();
                onAction(a.key);
                setOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-[12px] text-popover-foreground hover:bg-accent hover:text-copper transition-colors"
            >
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
