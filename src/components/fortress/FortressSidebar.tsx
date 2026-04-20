import { NavLink, useLocation } from "react-router-dom";
import { LayoutGrid, BookMarked, ScanSearch, FileBarChart2, Sun, Moon, Radar } from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { runScanPlaceholder } from "@/lib/scanPlaceholder";

const items = [
  { label: "Dashboard", to: "/", icon: LayoutGrid },
  { label: "Asset Library", to: "/library", icon: BookMarked },
  { label: "Suspect Database", to: "/suspect", icon: ScanSearch },
  { label: "Match Reports", to: "/reports", icon: FileBarChart2 },
];

export function FortressSidebar() {
  const { pathname } = useLocation();
  const { theme, toggle } = useTheme();

  return (
    <aside className="w-60 shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="px-5 pt-6 pb-5 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="brushed-copper h-10 w-10 rounded-md grid place-items-center shadow-[0_4px_16px_-6px_hsl(22_60%_30%/0.7)] ring-1 ring-[hsl(22_70%_55%/0.4)]">
            <span className="font-display text-[15px] font-semibold tracking-tight text-[hsl(38_70%_92%)] drop-shadow-[0_1px_0_rgba(0,0,0,0.5)]">
              IPF
            </span>
          </div>
          <div className="leading-tight">
            <p className="font-display text-base text-foreground">IP-Fortress</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Asset Integrity</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="px-2 pb-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
          Workspace
        </p>
        {items.map((item) => {
          const active = pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`group flex items-center gap-3 rounded-md px-3 py-2 text-[13px] transition-colors relative ${
                active
                  ? "text-foreground bg-sidebar-accent"
                  : "text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent/60"
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-r bg-copper" />
              )}
              <item.icon className="h-4 w-4 opacity-80" strokeWidth={1.6} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-3">
        <button
          type="button"
          onClick={runScanPlaceholder}
          className="w-full brushed-copper rounded-md px-4 py-3 flex items-center justify-center gap-2 group ring-1 ring-[hsl(22_70%_55%/0.45)] shadow-[0_8px_24px_-12px_hsl(22_60%_25%/0.8)] hover:ring-[hsl(22_75%_60%/0.7)] transition-all"
        >
          <Radar className="h-4 w-4 text-[hsl(38_75%_85%)] drop-shadow-[0_1px_0_rgba(0,0,0,0.4)]" strokeWidth={1.8} />
          <span className="font-display text-[13px] tracking-wide text-[hsl(38_75%_88%)] drop-shadow-[0_1px_0_rgba(0,0,0,0.4)]">
            Run Scan
          </span>
        </button>
      </div>

      {/* Theme toggle */}
      <div className="p-3 pt-0">
        <button
          onClick={toggle}
          className="w-full flex items-center justify-between rounded-md border border-sidebar-border bg-sidebar-accent/40 px-3 py-2 text-[12px] text-sidebar-foreground hover:text-foreground transition-colors"
        >
          <span className="flex items-center gap-2">
            {theme === "dark" ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
            {theme === "dark" ? "Warm Cocoa" : "Vellum"}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Switch</span>
        </button>
      </div>
    </aside>
  );
}
