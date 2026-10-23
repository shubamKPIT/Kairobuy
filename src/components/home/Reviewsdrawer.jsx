"use client";

import { useEffect, useMemo, useState } from "react";
import { FaStar } from "react-icons/fa";
import { FiChevronDown, FiThumbsUp, FiX } from "react-icons/fi";

/*
  Accepts your Mongo Review documents directly (userName, createdAt, title,
  comment, rating, isVerifiedPurchase, populated productId) and also the
  simple shape below.

  Simple shape:
  {
    id: "1",
    name: "Manish Sonkar",
    rating: 5,                       // 1-5
    date: "2025-12-27",              // any date string
    comment: "Very good",
    product: "Mens Solid Polo T-Shirt", // optional
    image: "/images/p1.jpg",            // optional product image
    likes: 9,                           // optional
    type: "product",                    // optional: "product" | "shop"
  }
*/

const SAMPLE_REVIEWS = [
  {
    id: "1",
    name: "Manish Sonkar",
    rating: 5,
    date: "2025-12-27",
    comment: "Very good",
    product: "Mens Solid Polo T-Shirt",
    likes: 9,
    type: "product",
  },
  {
    id: "2",
    name: "Manish Sonkar",
    rating: 4,
    date: "2025-12-27",
    comment: "Good",
    product: "Men's All Over Printed Polo T-Shirt",
    likes: 4,
    type: "product",
  },
  {
    id: "3",
    name: "Aarav Singh",
    rating: 5,
    date: "2025-12-16",
    comment: "Fast delivery and great packaging.",
    likes: 2,
    type: "shop",
  },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "highest", label: "Highest Rating" },
  { value: "lowest", label: "Lowest Rating" },
];

function Stars({ rating, size = 18 }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <FaStar
          key={n}
          size={size}
          className={n <= Math.round(rating) ? "text-yellow-400" : "text-zinc-200"}
        />
      ))}
    </div>
  );
}

function formatDate(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value || "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export default function ReviewsDrawer({
  reviews: rawReviews = SAMPLE_REVIEWS,
  summary, // optional: { count, average } for all reviews in the database
  onWriteReview,
  // Pagination + server-side sorting (all optional, provided by the loader)
  sort: sortProp,
  onSortChange,
  hasMore = false,
  onLoadMore,
  isLoading = false,
}) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("product");
  const [localSort, setLocalSort] = useState("newest");
  const serverSort = typeof onSortChange === "function";
  const sort = serverSort ? sortProp || "newest" : localSort;
  const [sortOpen, setSortOpen] = useState(false);
  const [liked, setLiked] = useState({});

  // Normalize Mongo review documents into what the UI needs
  const reviews = useMemo(
    () =>
      rawReviews.map((r) => {
        const product =
          r.productName ||
          (typeof r.product === "string" ? r.product : "") ||
          r.productId?.name ||
          r.productId?.title ||
          "";
        const firstImage = r.productId?.images?.[0] ?? r.productId?.image;
        const image =
          r.image ||
          r.productImage ||
          (typeof firstImage === "string" ? firstImage : firstImage?.url) ||
          "";

        return {
          id: String(r.id ?? r._id),
          name: r.name ?? r.userName ?? "Kairobuy customer",
          rating: r.rating,
          date: r.date ?? r.createdAt,
          title: r.title || "",
          comment: r.comment || "",
          verified: Boolean(r.isVerifiedPurchase ?? r.verified),
          product,
          image,
          likes: r.likes,
          type: r.type || "product",
        };
      }),
    [rawReviews]
  );

  // Close with Escape and lock page scroll while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const average = useMemo(() => {
    if (!reviews.length) return 0;
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  }, [reviews]);

  const totalCount = summary?.count ?? reviews.length;
  const averageRating = summary?.average ?? average;
  const shopTabCount = reviews.filter((r) => r.type === "shop").length;
  const productCount =
    shopTabCount > 0
      ? reviews.filter((r) => (r.type || "product") === "product").length
      : totalCount;
  const shopCount = reviews.filter((r) => r.type === "shop").length;

  const visibleReviews = useMemo(() => {
    const list = reviews.filter((r) => (r.type || "product") === tab);

    // With pagination the server already returns them in the right order
    if (serverSort) return list;

    const sorted = [...list];
    if (sort === "highest") {
      sorted.sort((a, b) => b.rating - a.rating);
    } else if (sort === "lowest") {
      sorted.sort((a, b) => a.rating - b.rating);
    } else {
      sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    return sorted;
  }, [reviews, tab, sort, serverSort]);

  const toggleLike = (id) =>
    setLiked((current) => ({ ...current, [id]: !current[id] }));

  const currentSortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label;

  return (
    <>
      {/* Floating tab on the right edge */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open reviews"
          className="fixed right-0 top-1/2 z-40 flex -translate-y-1/2 flex-col items-center gap-2 rounded-l-xl bg-white px-3 py-4 shadow-[0_0_12px_rgba(0,0,0,0.18)] transition hover:pr-4"
        >
          <span className="rotate-180 text-sm font-bold text-zinc-900 [writing-mode:vertical-rl]">
            Reviews
          </span>
          <FaStar size={18} className="text-zinc-900" />
        </button>
      )}

      {/* Overlay */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Our reviews"
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white text-zinc-900 shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="px-6 pt-6">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close reviews"
              className="grid size-9 place-items-center rounded-full text-zinc-700 transition hover:bg-zinc-100"
            >
              <FiX size={24} />
            </button>
          </div>

          <h2 className="mt-2 text-2xl font-extrabold">Our Reviews</h2>

          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-bold">
              <FaStar size={20} className="text-yellow-400" />
              <span>{Number(averageRating).toFixed(1)}</span>
              <span className="h-5 w-px bg-zinc-300" />
              <span>{totalCount} reviews</span>
            </div>

            <button
              type="button"
              onClick={onWriteReview}
              className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-zinc-700"
            >
              Write a review
            </button>
          </div>
        </div>

        {/* Tabs (Shop tab only appears when you have shop reviews) */}
        <div
          className={`grid border-b border-zinc-200 text-sm font-semibold ${
            shopCount > 0 ? "grid-cols-2" : "grid-cols-1"
          }`}
        >
          {[
            { key: "product", label: `${productCount} Reviews` },
            ...(shopCount > 0
              ? [{ key: "shop", label: `${shopCount} Shop reviews` }]
              : []),
          ].map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`border-b-2 py-3 transition ${
                tab === t.key
                  ? "border-zinc-900 text-zinc-900"
                  : "border-transparent text-zinc-500 hover:text-zinc-900"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="relative flex justify-end px-6 py-4">
          <button
            type="button"
            onClick={() => setSortOpen((v) => !v)}
            className="flex items-center gap-1 text-sm text-zinc-600"
          >
            Sort by: <span className="font-bold text-zinc-900">{currentSortLabel}</span>
            <FiChevronDown size={16} />
          </button>

          {sortOpen && (
            <div className="absolute right-6 top-12 z-10 w-44 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-lg">
              {SORT_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => {
                    if (serverSort) onSortChange(o.value);
                    else setLocalSort(o.value);
                    setSortOpen(false);
                  }}
                  className={`block w-full px-4 py-2.5 text-left text-sm transition hover:bg-zinc-50 ${
                    sort === o.value ? "font-bold" : ""
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Review list (scrolls inside the drawer) */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {visibleReviews.length === 0 && (
            <p className="py-10 text-center text-sm text-zinc-500">
              No reviews yet.
            </p>
          )}

          {visibleReviews.map((review) => {
            const isLiked = Boolean(liked[review.id]);
            return (
              <article
                key={review.id}
                className="border-b border-zinc-200 py-5 last:border-b-0"
              >
                <div className="flex items-center justify-between">
                  <Stars rating={review.rating} />
                  <span className="text-sm text-zinc-500">
                    {formatDate(review.date)}
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-3">
                  {review.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={review.image}
                      alt=""
                      className="size-12 rounded border border-zinc-200 object-cover"
                    />
                  )}
                  <div>
                    <p className="flex flex-wrap items-center gap-2 font-bold text-zinc-900">
                      {review.name}
                      {review.verified && (
                        <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-xs font-semibold text-emerald-700">
                          Verified purchase
                        </span>
                      )}
                    </p>
                    {review.product && (
                      <p className="text-sm text-zinc-500">{review.product}</p>
                    )}
                  </div>
                </div>

                {review.title && (
                  <p className="mt-3 text-sm font-bold text-zinc-900">
                    {review.title}
                  </p>
                )}
                {review.comment && (
                  <p className="mt-2 text-sm text-zinc-800">{review.comment}</p>
                )}

                {review.likes !== undefined && (
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => toggleLike(review.id)}
                    aria-pressed={isLiked}
                    className={`flex items-center gap-1.5 text-sm font-semibold ${
                      isLiked ? "text-zinc-900" : "text-zinc-600"
                    }`}
                  >
                    {(review.likes || 0) + (isLiked ? 1 : 0)}
                    <FiThumbsUp
                      size={17}
                      className={isLiked ? "fill-zinc-900" : ""}
                    />
                  </button>
                </div>
                )}
              </article>
            );
          })}

          {hasMore && (
            <div className="pt-5">
              <button
                type="button"
                onClick={onLoadMore}
                disabled={isLoading}
                className="w-full rounded-lg border border-zinc-900 py-3 text-sm font-bold text-zinc-900 transition hover:bg-zinc-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Loading..." : "Load more reviews"}
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}