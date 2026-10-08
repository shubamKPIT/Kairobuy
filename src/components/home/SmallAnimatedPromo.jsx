import Link from "next/link";
import ProductImage from "../products/ProductImage";

export default function SmallAnimatedPromo({
  href = "/category/all",
  imageUrl = "/images/Promo.gif",
  title = "Shop the latest offer",
}) {
  // Next.js can't resize animated GIFs, so serve them as-is
  const isGif = /\.gif($|\?)/i.test(imageUrl);

  return (
    <section className="overflow-hidden bg-gray-50">
      <div className="mx-auto w-full max-w-full bg-gray-50">
        <Link
          href={href}
          aria-label={title}
          className="group block overflow-hidden bg-zinc-100 shadow-sm transition duration-300"
        >
          <ProductImage
            src={imageUrl}
            alt={title}
            width={0}
            height={0}
            sizes="100vw"
            unoptimized={isGif ? true : undefined}
            loading="lazy"
            decoding="async"
            className="block h-auto w-full"
          />
        </Link>
      </div>
    </section>
  );
}