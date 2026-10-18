import { createServerFn } from "@tanstack/react-start";
import { setResponseHeader } from "@tanstack/react-start/server";

export const getYouTubeUpdates = createServerFn({ method: "GET" }).handler(async () => {
  const key = process.env["GOOGLE_API_KEY"];
  if (!key) return { videos: [], error: "YouTube isn't configured yet." };
  const { fetchYouTubeUploads } = await import("./youtube.server");
  const result = await fetchYouTubeUploads(key);
  setResponseHeader("Cache-Control", result.error ? "no-store" : "public, max-age=300");
  return result;
});