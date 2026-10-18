export const YOUTUBE_CHANNELS = [
  { id: "UC3IZKseVpdzPSBaWxBxundA", name: "HYBE LABELS", uploads: "UU3IZKseVpdzPSBaWxBxundA" },
  { id: "UCaO6TYtlC8U5ttz62hTrZgg", name: "JYP Entertainment", uploads: "UUaO6TYtlC8U5ttz62hTrZgg" },
  { id: "UCEf_Bc-KVd7onSeifS3py9g", name: "SMTOWN", uploads: "UUEf_Bc-KVd7onSeifS3py9g" },
] as const;

export interface YouTubeVideo {
  id: string;
  title: string;
  channelId: string;
  channel: string;
  publishedAt: string;
  url: string;
}

export interface YouTubeResult {
  videos: YouTubeVideo[];
  error: string | null;
}

export function selectVideos(videos: YouTubeVideo[], days: number, channelId = "all", limit = 12, now = Date.now()) {
  const cutoff = now - days * 86_400_000;
  return videos.filter((video) => {
    const published = Date.parse(video.publishedAt);
    return published >= cutoff && published <= now && (channelId === "all" || video.channelId === channelId);
  }).sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt)).slice(0, limit);
}