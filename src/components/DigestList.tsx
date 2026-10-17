import type { Item } from "@/lib/data";

export function DigestList({ items }: { items: Item[] }) {
  if (!items.length) return <p className="text-muted-foreground">Nothing new in this window.</p>;
  return (
    <ol className="space-y-4">
      {items.map((i) => (
        <li key={i.id} className="card-pop rounded-2xl border-2 border-foreground bg-card p-5">
          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
            <span className={`rounded-full px-2.5 py-0.5 font-semibold ${i.verified ? "bg-verified text-verified-foreground" : "bg-buzz text-buzz-foreground"}`}>
              {i.verified ? "✓ Official" : "💬 Fan buzz · unverified"}
            </span>
            <span className="text-muted-foreground">{i.daysAgo === 0 ? "Today" : `${i.daysAgo}d ago`}</span>
            {i.cp && <span className="text-primary">♡ {i.cp}</span>}
          </div>
          <h3 className="font-display text-lg font-bold">{i.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{i.summary}</p>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span>{i.members.length === 5 ? "All members" : i.members.join(", ")}</span>
            <a href={i.url} target="_blank" rel="noreferrer" className="underline underline-offset-2">{i.source} ↗</a>
          </div>
        </li>
      ))}
    </ol>
  );
}
