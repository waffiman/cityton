/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ['10.10.4.112'],
  images: {
    // All imagery is local (public/media). Add remotePatterns here once a CMS serves it.
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [{ source: "/referenzen", destination: "/gallery", permanent: true }];
  },
};

export default nextConfig;
