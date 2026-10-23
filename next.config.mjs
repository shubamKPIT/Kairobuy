/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75, 85 , 100],
    minimumCacheTTL: 604800, // 7 days
    remotePatterns: [
      { protocol: "https", hostname: "**.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "images.pexels.com" },
    ],
  },
  experimental: {
    staleTimes: {
      dynamic: 300,
      static: 300,
    },
  },
};

export default nextConfig;