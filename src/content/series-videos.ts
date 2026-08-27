export type SeriesVideo = {
  /** YouTube video id — see YouTubeEmbed: nothing loads from Google until a click. */
  youtubeId: string;
  /** The clip's own title, shown as the caption. */
  title: string;
  /** Self-hosted first frame — keeps the facade free of third-party requests. */
  poster: string;
  /** Channel the clip comes from. */
  credit: string;
};

/** Manufacturer demo clips shown on a series page. Keyed by series slug. */
export const seriesVideos: Record<string, SeriesVideo[]> = {
  safety: [
    {
      youtubeId: "Qp4JwzyOGFU",
      title: "LLumar Safety & Security Film Baseball Bat Demonstration",
      poster: "/media/video-posters/llumar-safety-baseball-bat.jpg",
      credit: "LLumar Films",
    },
  ],
};
