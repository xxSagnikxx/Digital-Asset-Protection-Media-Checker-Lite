import { AppShell } from "@/components/fortress/AppShell";

export default function Placeholder({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <AppShell>
      <div className="h-screen overflow-y-auto">
        <header className="px-8 py-5 border-b border-hairline">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Module</p>
          <h1 className="font-display text-3xl text-foreground leading-tight mt-0.5">{title}</h1>
        </header>
        <div className="p-8">
          <div className="panel rounded-md p-12 text-center">
            <p className="font-display text-xl text-foreground">{title}</p>
            <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">{subtitle}</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
