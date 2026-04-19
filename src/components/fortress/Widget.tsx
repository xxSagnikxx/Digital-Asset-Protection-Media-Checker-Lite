import { ReactNode } from "react";

interface WidgetProps {
  label: string;
  hint?: string;
  children: ReactNode;
  actions?: ReactNode;
}

export function Widget({ label, hint, children, actions }: WidgetProps) {
  return (
    <div className="panel rounded-md p-5 flex flex-col h-full">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/80">
            {label}
          </p>
          {hint && <p className="text-[11px] text-muted-foreground mt-0.5">{hint}</p>}
        </div>
        {actions}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
