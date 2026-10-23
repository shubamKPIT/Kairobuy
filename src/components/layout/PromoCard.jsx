"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiX } from "react-icons/fi";

/*
  Small promo card in the bottom-left corner.
  - Hidden on mobile (shows from the md breakpoint, 768px, and up).
  - Appears after the visitor scrolls down 40% of the page.
  - Two slides move from right to left automatically (pauses on hover).
  - The X closes it. It comes back when the page is refreshed.
  Edit SLIDES below: image, title, text and the page it links to.
  Images use next/image, so they are resized and compressed automatically.
  Local images go in public/images (e.g. "/images/promo1.jpg").
  Images from another website must be allowed in next.config.js (images.remotePatterns).
*/

const SLIDES = [
  {
    image: "https://images.pexels.com/photos/7081100/pexels-photo-7081100.jpeg",
    title: "New arrivals are here",
    text: "Fresh styles added this week.",
    href: "/category/new",
  },
  {
    image: "https://images.pexels.com/photos/9476367/pexels-photo-9476367.jpeg",
    title: "Free delivery",
    text: "On your first order above Rs. 999.",
    href: "/category/all",
  },
];

const SLIDE_MS = 4000;
const SHOW_AFTER_SCROLL = 0.4; // 40% of the page

export default function PromoCard() {
  const [scrolled, setScrolled] = useState(false);
  const [closed, setClosed] = useState(false);
  const visible = scrolled && !closed;
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);

  // Show once the visitor has scrolled 40% of the page
  useEffect(() => {
    const onScroll = () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      if (window.scrollY / scrollable >= SHOW_AFTER_SCROLL) {
        setScrolled(true);
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Move to the next slide every few seconds
  useEffect(() => {
    if (!visible || paused) return;
    const timer = setInterval(() => {
      setAnimate(true);
      setIndex((current) => current + 1);
    }, SLIDE_MS);
    return () => clearInterval(timer);
  }, [visible, paused]);

  const handleClose = () => {
    setClosed(true);
  };

  // After sliding onto the copy of slide 1, jump back to the real slide 1
  // without animation so the motion always looks right to left.
  const handleTransitionEnd = () => {
    if (index === SLIDES.length) {
      setAnimate(false);
      setIndex(0);
    }
  };

  if (!visible) return null;

  const track = [...SLIDES, SLIDES[0]];
  const activeDot = index % SLIDES.length;

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="fixed bottom-5 left-5 z-40 hidden h-36 w-72 overflow-hidden rounded-xl bg-zinc-900 opacity-90 shadow-lg shadow-black/30 transition-opacity hover:opacity-100 md:block"
    >
      <div
        onTransitionEnd={handleTransitionEnd}
        className={`flex h-full ${
          animate ? "transition-transform duration-700 ease-in-out" : ""
        }`}
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {track.map((slide, i) => (
          <Link
            key={i}
            href={slide.href}
            className="relative flex h-full w-full shrink-0 flex-col justify-end overflow-hidden p-4 text-white"
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              sizes="288px"
              quality={75}
              className="object-cover"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
            <span className="relative text-base font-bold leading-tight">
              {slide.title}
            </span>
            <span className="relative mt-0.5 text-xs text-white/85">
              {slide.text}
            </span>
          </Link>
        ))}
      </div>

      {/* Dots */}
      <div className="pointer-events-none absolute bottom-2 right-3 flex gap-1.5">
        {SLIDES.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === activeDot ? "w-4 bg-white" : "w-1.5 bg-white/50"
            }`}
          />
        ))}
      </div>

      {/* Close */}
      <button
        type="button"
        onClick={handleClose}
        aria-label="Close"
        className="absolute right-2 top-2 grid size-7 place-items-center text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] transition hover:scale-110"
      >
        <FiX size={16} />
      </button>
    </div>
  );
}