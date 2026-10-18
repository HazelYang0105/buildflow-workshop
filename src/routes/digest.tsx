import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell, Chip } from "@/components/Shell";
import { DigestList } from "@/components/DigestList";
import { buildDigest, loadPrefs, type Prefs } from "@/lib/data";
import { YouTubeFeed } from "@/components/YouTubeFeed";
import { youtubeQueryOptions } from "@/lib/youtube-query";

export const Route = createFileRoute("/digest")({
  loader: ({ context }) => context.queryClient.ensureQueryData(youtubeQueryOptions),
  head: () => ({
    meta: [
      { title: "Today's Brief — BiasBrief" },
      { name: "description", content: "Your personalized K-pop daily digest: official updates and fan buzz ranked for you." },
      { property: "og:title", content: "Today's Brief — BiasBrief" },
      { property: "og:description", content: "Personalized idol updates and fan buzz, ranked for you." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Digest,
});

function Digest() {
  const [prefs, setPrefs] = useState<Prefs | null>(null);
  const [personal, setPersonal] = useState(true);
  useEffect(() => setPrefs(loadPrefs()), []);
  const items = buildDigest(prefs, 1, 6, personal);
  const official = items.filter((i) => i.verified).length;

  return (
    <Shell>
      <p className="text-sm text-muted-foreground">{new Date().toDateString()}</p>
      <h1 className="font-display mt-1 text-4xl font-bold">Today's brief</h1>
      {!prefs && (
        <p className="mt-3 text-sm">Showing a general digest. <Link to="/" className="text-primary underline">Set your profile</Link> to personalize.</p>
      )}
      {prefs && (
        <p className="mt-3 text-muted-foreground">
          {prefs.stanType}{prefs.members.length ? ` · ${prefs.members.join(", ")}` : ""}{prefs.cps.length ? ` · ♡ ${prefs.cps.join(", ")}` : ""}
        </p>
      )}
      <YouTubeFeed days={1} />
      <h2 className="font-display mt-8 text-2xl font-bold">LUMIÈRE · Sample brief</h2>
      <div className="my-6 border-y border-border py-5 text-sm">
        <strong>TL;DR:</strong> {items.length} updates — {official} official, {items.length - official} fan buzz. {items[0] && `Top story: ${items[0].title}.`}
      </div>
      <div className="mb-5 flex gap-2">
        <Chip on={personal} onClick={() => setPersonal(true)}>For you</Chip>
        <Chip on={!personal} onClick={() => setPersonal(false)}>Chronological</Chip>
      </div>
      <DigestList items={items} />
    </Shell>
  );
}
