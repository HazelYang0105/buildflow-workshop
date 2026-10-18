import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ExternalLink, Youtube } from "lucide-react";
import { Chip } from "./Shell";
import { selectVideos, YOUTUBE_CHANNELS } from "@/lib/youtube";
import { youtubeQueryOptions } from "@/lib/youtube-query";

export function YouTubeFeed({ days, limit = 12 }: { days: number; limit?: number }) {
  const { data } = useSuspenseQuery(youtubeQueryOptions);
  const [channel, setChannel] = useState("all");
  const videos = selectVideos(data.videos, days, channel, limit);
  return (
    <section aria-labelledby="youtube-heading" className="mt-8 border-y border-border py-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="youtube-heading" className="font-display flex items-center gap-2 text-2xl font-bold"><Youtube className="text-primary" />YouTube updates</h2>
        <span className="text-xs font-semibold text-verified">Official channels · Live</span>
      </div>
      <div className="my-5 flex flex-wrap gap-2">
        <Chip on={channel === "all"} onClick={() => setChannel("all")}>All channels</Chip>
        {YOUTUBE_CHANNELS.map((item) => <Chip key={item.id} on={channel === item.id} onClick={() => setChannel(item.id)}>{item.name}</Chip>)}
      </div>
      {data.error && <p role="status" className="mb-4 text-sm text-muted-foreground">{data.error}</p>}
      {!videos.length && !data.error && <p className="text-sm text-muted-foreground">No new public uploads in the last {days === 1 ? "24 hours" : `${days} days`}.</p>}
      <ol className="grid gap-4 md:grid-cols-2">
        {videos.map((video) => (
          <li key={video.id} className="rounded-lg border border-border bg-card p-5">
            <div className="mb-2 flex flex-wrap gap-2 text-xs text-muted-foreground"><span className="font-semibold text-primary">{video.channel}</span><time dateTime={video.publishedAt}>{new Date(video.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })}</time></div>
            <h3 className="font-display text-lg font-bold"><a href={video.url} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">{video.title}<ExternalLink aria-hidden="true" className="ml-2 inline size-4" /></a></h3>
          </li>
        ))}
      </ol>
    </section>
  );
}