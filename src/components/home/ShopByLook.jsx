"use client";

import Link from "next/link";
import Image from "next/image";

/**
 * Photos live in:
 *   public/images/image1.png  (left)
 *   public/images/image2.png  (right)
 *
 * href -> where the photo links to when clicked
 *         (for example a category page or a product page)
 */
const looks = [
  {
    src: "/images/image3.webp",
    alt: "Look 1",
    href: "/category/all",
  },
  {
    src: "/images/image4.webp",
    alt: "Look 2",
    href: "/category/all",
  },
];

export default function ShopByLook() {
  return (
    <section className="bg-gray-50 py-8 sm:py-10 ">
      {/* Top-left heading, same style as the other section */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-amber-700 sm:text-xs sm:tracking-[0.22em]">
          Complete the outfit
        </p>

        <h2 className="mt-3 text-3xl font-black tracking-tight text-zinc-950 sm:mt-4 sm:text-5xl">
          Shop by Look.
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600 sm:mt-4 sm:text-base sm:leading-7">
          Styled outfits put together for you. Tap a look to shop the products.
        </p>
      </div>

      {/* Two full-width images: left and right */}
      <div className="mt-8 grid w-full grid-cols-2 sm:mt-10">
        {looks.map((look) => (
          <Link
            key={look.src}
            href={look.href}
            aria-label={look.alt}
            className="group relative block aspect-[4/5] w-full overflow-hidden bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-zinc-950"
          >
            <Image
              src={look.src}
              alt={look.alt}
              fill
              sizes="(min-width: 1600px) 800px, 50vw"
              quality={100}
              priority
              className="object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-105"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
