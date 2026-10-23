"use client";

import { useEffect, useRef, useState } from "react";
import ReviewsDrawer from "./Reviewsdrawer";

const PAGE_SIZE = 5;

// Loads reviews 5 at a time from /api/reviews and passes them to the drawer.
export default function ReviewsDrawerLoader() {
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sort, setSort] = useState("newest");

  // Used to ignore slow responses that are no longer needed
  const requestId = useRef(0);

  const fetchReviews = async ({ skip = 0, sortKey = sort } = {}) => {
    const id = ++requestId.current;
    setIsLoading(true);

    try {
      const res = await fetch(
        `/api/reviews?limit=${PAGE_SIZE}&skip=${skip}&sort=${sortKey}`
      );
      const data = res.ok ? await res.json() : null;

      if (!data || id !== requestId.current) return;

      setReviews((current) =>
        skip === 0 ? data.reviews || [] : [...current, ...(data.reviews || [])]
      );
      setHasMore(Boolean(data.hasMore));
      if (data.summary) setSummary(data.summary);
    } catch {
      // keep whatever is already loaded
    } finally {
      if (id === requestId.current) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews({ skip: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSortChange = (nextSort) => {
    setSort(nextSort);
    fetchReviews({ skip: 0, sortKey: nextSort });
  };

  const handleLoadMore = () => {
    fetchReviews({ skip: reviews.length });
  };

  // Don't show the floating tab until there is something to show
  if (reviews.length === 0 && !isLoading) return null;
  if (reviews.length === 0) return null;

  return (
    <ReviewsDrawer
      reviews={reviews}
      summary={summary}
      sort={sort}
      onSortChange={handleSortChange}
      hasMore={hasMore}
      onLoadMore={handleLoadMore}
      isLoading={isLoading}
    />
  );
}