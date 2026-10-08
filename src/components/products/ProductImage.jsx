import Image from "next/image";

// Keep in sync with images.remotePatterns in next.config.mjs
const OPTIMIZED_HOSTS = ["images.pexels.com", "chromeindustries.com"];
const OPTIMIZED_HOST_SUFFIXES = [".public.blob.vercel-storage.com"];

function canOptimize(src) {
  if (typeof src !== "string") return true; // static imports
  if (src.startsWith("data:") || src.startsWith("blob:")) return true;
  if (src.startsWith("/") && !src.startsWith("//")) return true; // local /public file

  try {
    const url = new URL(src.startsWith("//") ? `https:${src}` : src);
    if (url.protocol !== "https:") return false;

    return (
      OPTIMIZED_HOSTS.includes(url.hostname) ||
      OPTIMIZED_HOST_SUFFIXES.some((suffix) => url.hostname.endsWith(suffix))
    );
  } catch {
    return false;
  }
}

export default function ProductImage({ src, unoptimized, ...props }) {
  return (
    <Image
      src={src}
      unoptimized={unoptimized ?? !canOptimize(src)}
      {...props}
    />
  );
}