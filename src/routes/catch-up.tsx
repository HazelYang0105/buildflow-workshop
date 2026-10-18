import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell, Chip } from "@/components/Shell";
import { DigestList } from "@/components/DigestList";
import { buildDigest, loadPrefs, type Prefs } from "@/lib/data";
import { YouTubeFeed } from "@/components/YouTubeFeed";
import { youtubeQueryOptions } from "@/lib/youtube-query";

export const Route = createFileRoute("/catch-up")({
  loader: ({ context }) => context.queryClient.ensureQueryData(youtubeQueryOptions),
  head: () => ({
    meta: [
      { title: "Catch-up Mode — BiasBrief" },
      { name: "description", content: "Been away? Summarize the last 1, 3 or 7 days of your fandom in 1, 3 or 10 minutes." },
      { property: "og:title", content: "Catch-up Mode — BiasBrief" },
      { property: "og:description", content: "Catch up on your fandom at your own pace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CatchUp,
});

function CatchUp() {
  const [prefs, setPrefs] = useState<Prefs | null>(null);
  const [days, setDays] = useState(3);
  const [mins, setMins] = useState(3);
  useEffect(() => setPrefs(loadPrefs()), []);
  const items = buildDigest(prefs, days, mins);

  return (
    <Shell>
      <h1 className="font-display text-4xl font-bold">Catch-up mode</h1>
      <p className="mt-2 text-muted-foreground">Been away? We'll fit what matters into your time.</p>
      <div className="mt-6 space-y-4">
        <Row label="I missed">
          {[1, 3, 7].map((d) => <Chip key={d} on={days === d} onClick={() => setDays(d)}>{d} day{d > 1 ? "s" : ""}</Chip>)}
        </Row>
        <Row label="I have">
          {[1, 3, 10].map((m) => <Chip key={m} on={mins === m} onClick={() => setMins(m)}>{m} min</Chip>)}
        </Row>
      </div>
      <YouTubeFeed days={days} limit={mins * 2} />
      <h2 className="font-display mt-8 text-2xl font-bold">LUMIÈRE · Sample catch-up</h2>
      <div className="mt-5"><DigestList items={items} /></div>
    </Shell>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-20 text-sm font-semibold">{label}</span>
      {children}
    </div>
  );
}
