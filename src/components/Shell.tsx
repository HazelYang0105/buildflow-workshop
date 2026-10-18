import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import stageImage from "@/assets/comeback-stage.jpg";

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8">
        <Link to="/" className="font-display flex items-center gap-2 text-2xl font-bold">
          <Sparkles aria-hidden="true" className="size-6 text-primary" />Bias<span className="-ml-2 text-primary">Brief</span>
        </Link>
        <nav aria-label="Main navigation" className="flex flex-wrap gap-1 text-sm">
          {([
            ["/", "Profile"],
            ["/digest", "Today"],
            ["/catch-up", "Catch-up"],
            ["/connections", "Connections"],
          ] as const).map(([to, l]) => (
            <Button key={to} asChild variant="ghost" size="sm" className="rounded-md"><Link to={to} activeProps={{ className: "bg-foreground text-background hover:bg-foreground hover:text-background" }} inactiveProps={{ className: "text-muted-foreground" }} activeOptions={{ exact: true }}>
              {l}
            </Link></Button>
          ))}
        </nav>
      </div>
      </header>
      <div className="relative isolate h-[280px] overflow-hidden bg-stage text-stage-foreground sm:h-[300px]">
        <img src={stageImage} alt="Fictional five-member K-pop group on a concert stage" width={1600} height={640} className="stage-image absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="mx-auto flex h-full max-w-6xl flex-col justify-center px-5 sm:px-8">
          <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-secondary"><Star className="size-4" aria-hidden="true" />For the fans. Always.</p>
          <p className="stage-title font-display font-bold">BiasBrief<span className="text-secondary">.</span></p>
          <p className="mt-4 text-sm font-medium uppercase tracking-widest">Your daily fandom fix</p>
        </div>
      </div>
      <div className="border-y border-foreground bg-secondary text-secondary-foreground"><div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-2 text-xs font-bold uppercase tracking-widest sm:px-8"><span>K-pop · On repeat</span><Star aria-hidden="true" className="size-4" /><span>Bias. Buzz. Brief.</span></div></div>
      <main className="mx-auto max-w-6xl px-5 pb-20 pt-8 sm:px-8">{children}</main>
      <footer className="border-t border-border px-5 py-6 text-center text-xs text-muted-foreground">BiasBrief <span className="text-primary">✦</span> Made for your fandom</footer>
    </div>
  );
}

export function Chip({ on, children, onClick }: { on: boolean; children: ReactNode; onClick: () => void }) {
  return (
    <Button aria-pressed={on} onClick={onClick} variant="outline" className={`h-10 rounded-md border px-4 text-sm font-medium transition ${on ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" : "border-border bg-card hover:border-primary hover:bg-accent"}`}>
      {children}
    </Button>
  );
}
