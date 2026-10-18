import { YOUTUBE_CHANNELS, type YouTubeResult, type YouTubeVideo } from "./youtube";

export async function fetchYouTubeUploads(apiKey: string, fetcher: typeof fetch = fetch): Promise<YouTubeResult> {
  const videos: YouTubeVideo[] = [];
  let error: string | null = null;
  for (const channel of YOUTUBE_CHANNELS) {
    try {
      const params = new URLSearchParams({ part: "snippet,contentDetails", playlistId: channel.uploads, maxResults: "25" });
      const response = await fetcher(`https://www.googleapis.com/youtube/v3/playlistItems?${params}`, {
        headers: { "X-Goog-Api-Key": apiKey },
        signal: AbortSignal.timeout(12_000),
      });
      if (!response.ok) {
        // Never log provider bodies or URLs: they can echo credentials.
        console.error("YouTube uploads request failed", response.status);
        error = response.status === 403
          ? "YouTube access was refused. Check that YouTube Data API v3 is enabled, your key permits it, and quota is available."
          : `YouTube couldn't load some channels (${response.status}). Try again later.`;
        continue;
      }
      const data = await response.json() as { items?: { snippet?: { title?: string; resourceId?: { videoId?: string } }; contentDetails?: { videoId?: string; videoPublishedAt?: string } }[] };
      for (const item of data.items ?? []) {
        const id = item.contentDetails?.videoId ?? item.snippet?.resourceId?.videoId;
        const publishedAt = item.contentDetails?.videoPublishedAt;
        const title = item.snippet?.title;
        if (!id || !/^[\w-]{11}$/.test(id) || !publishedAt || !Number.isFinite(Date.parse(publishedAt)) || !title || title === "Private video" || title === "Deleted video") continue;
        if (videos.some((video) => video.id === id)) continue;
        videos.push({ id, title, channelId: channel.id, channel: channel.name, publishedAt, url: `https://www.youtube.com/watch?v=${id}` });
      }
    } catch {
      error = "YouTube is temporarily unavailable. Try again later.";
    }
  }
  return { videos, error };
}