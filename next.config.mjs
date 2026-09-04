import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

// Allow the S3-compatible image host (admin uploads) if configured.
const s3Base = process.env.S3_PUBLIC_BASE_URL;
let remotePatterns = [];
if (s3Base) {
  try {
    const u = new URL(s3Base);
    remotePatterns = [{ protocol: u.protocol.replace(":", ""), hostname: u.hostname }];
  } catch {
    // ignore malformed URL
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ['10.10.4.112'],
  images: {
    // Local imagery lives in public/media; admin uploads come from S3 (see remotePatterns).
    formats: ["image/avif", "image/webp"],
    remotePatterns,
    // Sources are 24-megapixel photos, so regenerating a variant is expensive.
    // 30 days instead of the 4-hour default. Note this is also the browser
    // max-age: replacing a file under the same name can stay stale in an
    // already-warm browser until it expires, so rename on replacement.
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async redirects() {
    return [{ source: "/referenzen", destination: "/gallery", permanent: true }];
  },
  async headers() {
    return [
      {
        // Static art in public/media was being served `public, max-age=0`, so
        // every visit re-validated every photo and video — several MB of
        // conditional requests per page view. Same 30 days as
        // `images.minimumCacheTTL` above, and the same caveat applies:
        // replacing a file under its existing name can stay stale in a warm
        // browser until it expires, so rename on replacement.
        source: "/media/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
