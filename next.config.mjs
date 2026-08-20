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
  },
  async redirects() {
    return [{ source: "/referenzen", destination: "/gallery", permanent: true }];
  },
};

export default nextConfig;
