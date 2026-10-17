import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-5 py-6">
        <Link to="/" className="font-display text-2xl font-bold tracking-tight">
          Bias<span className="text-primary">Brief</span>
        </Link>
        <nav className="flex gap-1 text-sm">
          {[
            ["/", "Profile"],
            ["/digest", "Today"],
            ["/catch-up", "Catch-up"],
          ].map(([to, l]) => (
            <Link key={to} to={to as "/"} className="rounded-full px-3 py-1.5 text-muted-foreground hover:text-foreground" activeProps={{ className: "bg-foreground text-background" }} activeOptions={{ exact: true }}>
              {l}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-3xl px-5 pb-20">{children}</main>
    </div>
  );
}

export function Chip({ on, children, onClick }: { on: boolean; children: ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`rounded-full border-2 px-4 py-2 text-sm font-medium transition ${on ? "border-foreground bg-primary text-primary-foreground" : "border-border bg-card hover:border-foreground"}`}>
      {children}
    </button>
  );
}
