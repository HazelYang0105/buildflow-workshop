import { queryOptions } from "@tanstack/react-query";
import { getYouTubeUpdates } from "./youtube.functions";

export const youtubeQueryOptions = queryOptions({
  queryKey: ["youtube-public-uploads"],
  queryFn: () => getYouTubeUpdates(),
  staleTime: 300_000,
  retry: false,
});