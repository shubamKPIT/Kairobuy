"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  FiCheckCircle,
  FiMessageSquare,
  FiStar,
  FiTrash2,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import {
  deleteProductReview,
  fetchProductReviews,
  submitProductReview,
} from "../../services/productService";
import ReviewModal from "./ReviewModal";

const PAGE_SIZE = 2;
const COMMENT_PREVIEW_LENGTH = 220;

const emptySummary = {
  average: 0,
  count: 0,
  distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
};

const ratingLabels = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

function formatDate(value) {
  if (!value) return "";

  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function StarRow({ value, size = 16 }) {
  return (
    <div className="flex items-center" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <FiStar
          key={index}
          size={size}
          className={
            index < value ? "fill-[#FFA41C] text-[#FFA41C]" : "text-zinc-300"
          }
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }) {
  const [expanded, setExpanded] = useState(false);
  const comment = review.comment || "";
  const isLong = comment.length > COMMENT_PREVIEW_LENGTH;

  return (
    <article className="flex min-w-0 flex-col rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-shadow hover:shadow-md sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-amber-50 text-sm font-bold uppercase text-amber-700">
            {(review.userName || "R").charAt(0)}
          </span>

          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-2">
              <span className="truncate text-sm font-semibold text-zinc-900">
                {review.userName}
              </span>

              {review.isMine && (
                <span className="shrink-0 rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-zinc-600">
                  You
                </span>
              )}
            </div>

            {review.isVerifiedPurchase && (
              <p className="mt-0.5 flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                <FiCheckCircle size={12} />
                Verified purchase
              </p>
            )}
          </div>
        </div>

        <p className="shrink-0 pt-1 text-xs text-zinc-400">
          {formatDate(review.createdAt)}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1">
        <StarRow value={review.rating} size={15} />

        {review.title && (
          <h3 className="min-w-0 break-words text-sm font-semibold text-zinc-950">
            {review.title}
          </h3>
        )}
      </div>

      {comment && (
        <>
          <p
            className={`mt-2.5 whitespace-pre-line break-words text-sm leading-6 text-zinc-700 ${
              isLong && !expanded ? "line-clamp-4" : ""
            }`}
          >
            {comment}
          </p>

          {isLong && (
            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              className="mt-2 self-start text-xs font-semibold text-amber-700 hover:text-amber-900 hover:underline"
            >
              {expanded ? "Show less" : "Read more"}
            </button>
          )}
        </>
      )}
    </article>
  );
}

export default function ProductReviews({
  productId,
  onSummaryChange,
  isFormOpen = false,
  onCloseForm,
}) {
  const { user, token } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(emptySummary);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(""); // shown inside the popup
  const [loadError, setLoadError] = useState(""); // shown in the section
  const [message, setMessage] = useState(""); // success banner in the section

  // Lets the parent update its stars without re-triggering our load effect.
  const onSummaryChangeRef = useRef(onSummaryChange);

  useEffect(() => {
    onSummaryChangeRef.current = onSummaryChange;
  }, [onSummaryChange]);

  const myReview = reviews.find((review) => review.isMine);

  const applyData = (data) => {
    const nextSummary = data?.summary || emptySummary;

    setReviews(Array.isArray(data?.reviews) ? data.reviews : []);
    setSummary(nextSummary);
    onSummaryChangeRef.current?.(nextSummary);
  };

  useEffect(() => {
    let isCancelled = false;

    async function loadReviews() {
      try {
        setIsLoading(true);
        setLoadError("");
        setVisibleCount(PAGE_SIZE);
        const data = await fetchProductReviews(productId, token);

        if (!isCancelled) {
          applyData(data);
        }
      } catch (requestError) {
        console.error("Review loading error:", requestError);

        if (!isCancelled) {
          setLoadError("Unable to load reviews right now.");
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    if (productId) {
      loadReviews();
    }

    return () => {
      isCancelled = true;
    };
  }, [productId, token]);

  // When the customer already reviewed this product, fill the form to edit it.
  useEffect(() => {
    if (myReview) {
      setRating(myReview.rating);
      setTitle(myReview.title || "");
      setComment(myReview.comment || "");
    } else {
      setRating(0);
      setTitle("");
      setComment("");
    }
  }, [myReview?._id, myReview?.updatedAt]);

  // Start each time the popup opens with a clean message state.
  useEffect(() => {
    if (isFormOpen) {
      setError("");
      setMessage("");
    }
  }, [isFormOpen]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!rating) {
      setError("Please choose a star rating.");
      return;
    }

    try {
      setIsSubmitting(true);

      await submitProductReview(productId, { rating, title, comment }, token);

      const data = await fetchProductReviews(productId, token);
      applyData(data);

      setMessage(
        myReview
          ? "Your review has been updated."
          : "Thank you! Your review has been posted."
      );
      onCloseForm?.();
    } catch (requestError) {
      setError(requestError.message || "Unable to save your review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setError("");
    setMessage("");

    try {
      setIsSubmitting(true);

      await deleteProductReview(productId, token);

      const data = await fetchProductReviews(productId, token);
      applyData(data);

      setMessage("Your review has been deleted.");
      onCloseForm?.();
    } catch (requestError) {
      setError(requestError.message || "Unable to delete your review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const shownRating = hoverRating || rating;
  const visibleReviews = reviews.slice(0, visibleCount);
  const hasMore = reviews.length > visibleCount;

  return (
    <section className="mt-8 w-full min-w-0 sm:mt-10">
      {/* Summary band */}
      <div className="grid w-full min-w-0 gap-6 rounded-3xl border border-zinc-200/80 bg-zinc-50/60 p-5 sm:p-7 md:grid-cols-[auto_1fr] md:items-center md:gap-12 lg:p-9">
        <div className="flex items-center gap-5 md:flex-col md:items-start md:gap-2 md:border-r md:border-zinc-200 md:pr-12 lg:pr-16">
          <p className="text-5xl font-light leading-none tracking-tighter text-zinc-950 sm:text-6xl lg:text-7xl">
            {summary.count > 0 ? summary.average.toFixed(1) : "–"}
          </p>

          <div>
            <StarRow value={Math.round(summary.average)} size={20} />
            <p className="mt-1.5 text-sm text-zinc-500">
              {summary.count > 0
                ? `Based on ${summary.count} rating${summary.count === 1 ? "" : "s"}`
                : "No ratings yet"}
            </p>
          </div>
        </div>

        <div className="w-full min-w-0 space-y-2.5 lg:max-w-xl">
          {[5, 4, 3, 2, 1].map((star) => {
            const starCount = summary.distribution?.[star] || 0;
            const percentage =
              summary.count > 0
                ? Math.round((starCount / summary.count) * 100)
                : 0;

            return (
              <div
                key={star}
                className="flex items-center gap-3 text-sm text-zinc-600"
              >
                <span className="flex w-9 shrink-0 items-center gap-1 font-medium">
                  {star}
                  <FiStar size={12} className="fill-[#FFA41C] text-[#FFA41C]" />
                </span>

                <div className="h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-zinc-200/70">
                  <div
                    className="h-full rounded-full bg-[#FFA41C] transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <span className="w-10 shrink-0 text-right tabular-nums text-zinc-500">
                  {percentage}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Success banner after the popup closes */}
      {message && (
        <p
          role="status"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700"
        >
          <FiCheckCircle size={15} />
          {message}
        </p>
      )}

      {loadError && (
        <p className="mt-5 text-sm font-semibold text-[#B12704]">{loadError}</p>
      )}

      {/* Review list */}
      <div className="mt-6 w-full min-w-0 sm:mt-8">
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:gap-5">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="h-36 animate-pulse rounded-2xl bg-zinc-100"
              />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="flex flex-col items-center rounded-3xl border border-dashed border-zinc-300 px-6 py-10 text-center sm:py-14">
            <span className="grid size-12 place-items-center rounded-full bg-amber-50 text-amber-600">
              <FiMessageSquare size={22} />
            </span>
            <p className="mt-4 font-semibold text-zinc-950">No reviews yet</p>
            <p className="mt-1 text-sm text-zinc-500">
              Be the first to review this product.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:gap-5">
              {visibleReviews.map((review) => (
                <ReviewCard key={review._id} review={review} />
              ))}
            </div>

            {hasMore && (
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                  className="h-11 rounded-full border border-zinc-300 bg-white px-8 text-sm font-medium text-zinc-900 transition hover:border-zinc-900 hover:bg-zinc-900 hover:text-white"
                >
                  Show more reviews
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Review form popup */}
      <ReviewModal
        open={isFormOpen}
        onClose={() => onCloseForm?.()}
        title={myReview ? "Edit your review" : "Review this product"}
      >
        {!user ? (
          <div className="text-center">
            <p className="text-sm text-zinc-600">
              Log in to share your thoughts with other customers.
            </p>
            <Link
              href={`/login?next=/product/${productId}`}
              className="mt-4 flex h-10 w-full items-center justify-center rounded-full bg-zinc-900 text-sm font-medium text-white transition hover:bg-black"
            >
              Log in to write a review
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-zinc-600">
              Share your thoughts with other customers.
            </p>

            <div>
              <div
                className="flex flex-wrap items-center gap-1"
                onMouseLeave={() => setHoverRating(0)}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    aria-label={`${star} star${star === 1 ? "" : "s"}`}
                    className="p-0.5"
                  >
                    <FiStar
                      size={28}
                      className={
                        star <= shownRating
                          ? "fill-[#FFA41C] text-[#FFA41C]"
                          : "text-zinc-300"
                      }
                    />
                  </button>
                ))}

                {shownRating > 0 && (
                  <span className="ml-2 text-sm font-medium text-zinc-700">
                    {ratingLabels[shownRating]}
                  </span>
                )}
              </div>
            </div>

            <label className="block">
              <span className="mb-1.5 block text-sm font-bold text-zinc-800">
                Headline
              </span>

              <input
                type="text"
                value={title}
                maxLength={120}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="What's most important to know?"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none transition focus:border-zinc-950"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-bold text-zinc-800">
                Written review
              </span>

              <textarea
                rows={5}
                value={comment}
                maxLength={1500}
                onChange={(event) => setComment(event.target.value)}
                placeholder="What did you like or dislike? How is the fit and quality?"
                className="w-full resize-y rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none transition focus:border-zinc-950"
              />
            </label>

            {error && (
              <p className="text-sm font-semibold text-[#B12704]">{error}</p>
            )}

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-10 flex-1 rounded-full bg-[#FFD814] text-sm font-medium text-zinc-950 transition hover:bg-[#F7CA00] disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-500"
              >
                {isSubmitting
                  ? "Saving..."
                  : myReview
                    ? "Update review"
                    : "Submit review"}
              </button>

              {myReview && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  aria-label="Delete your review"
                  className="grid size-10 place-items-center rounded-full border border-zinc-300 text-zinc-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                >
                  <FiTrash2 size={16} />
                </button>
              )}
            </div>
          </form>
        )}
      </ReviewModal>
    </section>
  );
}