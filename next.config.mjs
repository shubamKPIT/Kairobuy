/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "images.pexels.com" },
    ],
  },
  experimental: {
    staleTimes: {
      dynamic: 300, // seconds; reuse visited dynamic pages for 5 minutes
      static: 300,
    },
  },
};

export default nextConfig;
