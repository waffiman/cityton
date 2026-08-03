import { SECURITY_TEST_VIDEO_URL } from "@/content/products";

type VideoEmbedProps = {
  title: string;
  pendingLabel: string;
  className?: string;
};

export function VideoEmbed({ title, pendingLabel, className }: VideoEmbedProps) {
  if (!SECURITY_TEST_VIDEO_URL) {
    return (
      <div
        className={`flex aspect-video w-full flex-col items-center justify-center rounded-2xl bg-bg-soft ring-1 ring-dashed ring-border ${className ?? ""}`}
      >
        <p className="text-sm font-medium text-teal-dark">{title}</p>
        <p className="mt-2 text-xs text-text-muted">{pendingLabel}</p>
        {/* TODO: content — set SECURITY_TEST_VIDEO_URL in content/products.ts */}
      </div>
    );
  }

  const isYouTube =
    SECURITY_TEST_VIDEO_URL.includes("youtube.com") ||
    SECURITY_TEST_VIDEO_URL.includes("youtu.be");
  const isVimeo = SECURITY_TEST_VIDEO_URL.includes("vimeo.com");

  let src = SECURITY_TEST_VIDEO_URL;
  if (isYouTube) {
    const idMatch =
      SECURITY_TEST_VIDEO_URL.match(/[?&]v=([^&]+)/) ||
      SECURITY_TEST_VIDEO_URL.match(/youtu\.be\/([^?&]+)/);
    if (idMatch) src = `https://www.youtube-nocookie.com/embed/${idMatch[1]}`;
  } else if (isVimeo) {
    const idMatch = SECURITY_TEST_VIDEO_URL.match(/vimeo\.com\/(\d+)/);
    if (idMatch) src = `https://player.vimeo.com/video/${idMatch[1]}`;
  }

  return (
    <div className={`aspect-video w-full overflow-hidden rounded-2xl ${className ?? ""}`}>
      <iframe
        src={src}
        title={title}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}
