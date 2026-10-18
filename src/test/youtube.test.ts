import { describe, expect, it, vi } from "vitest";
import { fetchYouTubeUploads } from "@/lib/youtube.server";
import { selectVideos, YOUTUBE_CHANNELS, type YouTubeVideo } from "@/lib/youtube";

describe("Public YouTube updates", () => {
  it("reads only public uploads from the three curated K-pop channels", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({ items: [] })));
    await fetchYouTubeUploads("test-credential", fetcher);
    expect(fetcher).toHaveBeenCalledTimes(3);
    expect(fetcher.mock.calls.map(([url]) => new URL(String(url)).searchParams.get("playlistId"))).toEqual(YOUTUBE_CHANNELS.map((channel) => channel.uploads));
    expect(fetcher.mock.calls.every(([url]) => !new URL(String(url)).searchParams.has("key"))).toBe(true);
  });
  it("returns real public video links and excludes private or malformed uploads", async () => {
    const payload = { items: [
      { snippet: { title: "New comeback" }, contentDetails: { videoId: "abcdefghijk", videoPublishedAt: "2026-10-18T01:00:00Z" } },
      { snippet: { title: "Private video" }, contentDetails: { videoId: "private1234", videoPublishedAt: "2026-10-18T01:00:00Z" } },
      { snippet: { title: "Bad" }, contentDetails: { videoId: "invalid", videoPublishedAt: "bad-date" } },
    ] };
    const fetcher = vi.fn<typeof fetch>().mockImplementation(async () => new Response(JSON.stringify(payload)));
    const result = await fetchYouTubeUploads("test-credential", fetcher);
    expect(result.videos).toHaveLength(1);
    expect(result.videos[0]?.url).toBe("https://www.youtube.com/watch?v=abcdefghijk");
  });
  it("filters public updates by time window and selected channel", () => {
    const video: YouTubeVideo = { id: "abcdefghijk", title: "Comeback", channelId: "hybe", channel: "HYBE", publishedAt: "2026-10-18T01:00:00Z", url: "https://www.youtube.com/watch?v=abcdefghijk" };
    const old = { ...video, id: "old", publishedAt: "2026-10-16T01:00:00Z" };
    const now = Date.parse("2026-10-18T03:00:00Z");
    expect(selectVideos([old, video], 1, "all", 12, now)).toEqual([video]);
    expect(selectVideos([old, video], 3, "hybe", 1, now)).toEqual([video]);
    expect(selectVideos([video], 7, "jyp", 12, now)).toEqual([]);
  });
  it("handles failures without returning provider response bodies", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const fetcher = vi.fn<typeof fetch>().mockImplementation(async () => new Response("provider-internal-detail", { status: 403 }));
    const result = await fetchYouTubeUploads("test-credential", fetcher);
    expect(result.videos).toEqual([]);
    expect(result.error).toContain("YouTube access was refused");
    expect(JSON.stringify(result)).not.toContain("provider-internal-detail");
    log.mockRestore();
  });
});