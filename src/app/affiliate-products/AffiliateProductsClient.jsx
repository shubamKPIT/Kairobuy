"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FiExternalLink, FiInfo, FiSearch, FiX } from "react-icons/fi";
import ProductCard from "../../components/products/ProductCard";

const GUTTER = "px-4 sm:px-6 lg:px-8";

const sortOptions = ["Newest", "Top Rated", "Name: A to Z"];

const departments = ["ALL", "MEN", "WOMEN", "KIDS", "HOME", "ACCESSORIES"];

function departmentLabel(value) {
  return value === "ALL"
    ? "All"
    : value.charAt(0) + value.slice(1).toLowerCase();
}

export default function AffiliateProductsClient({ initialProducts = [] }) {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("ALL");
  const [partner, setPartner] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");

  // Partner filter only shows options that actually exist in the data
  const partnerOptions = useMemo(() => {
    const hasAmazon = initialProducts.some((p) => p.source === "AMAZON");
    const hasOther = initialProducts.some((p) => p.source !== "AMAZON");
    const options = ["All"];
    if (hasAmazon) options.push("Amazon");
    if (hasOther) options.push("Other partners");
    return options;
  }, [initialProducts]);

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = initialProducts.filter((product) => {
      if (department !== "ALL" && product.department !== department) {
        return false;
      }

      if (partner === "Amazon" && product.source !== "AMAZON") return false;
      if (partner === "Other partners" && product.source === "AMAZON") {
        return false;
      }

      if (query) {
        const haystack = [
          product.name,
          product.brand,
          product.category,
          product.subcategory,
        ]
          .join(" ")
          .toLowerCase();

        if (!haystack.includes(query)) return false;
      }

      return true;
    });

    const sorted = [...filtered];

    if (sortBy === "Top Rated") {
      sorted.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    } else if (sortBy === "Name: A to Z") {
      sorted.sort((a, b) => String(a.name).localeCompare(String(b.name)));
    }
    // "Newest" keeps the server order (featured first, then newest)

    return sorted;
  }, [initialProducts, search, department, partner, sortBy]);

  const hasActiveFilters =
    search.trim() !== "" || department !== "ALL" || partner !== "All";

  const clearFilters = () => {
    setSearch("");
    setDepartment("ALL");
    setPartner("All");
  };

  const chip = (active) =>
    `rounded-full border px-4 py-2 text-xs font-bold transition ${
      active
        ? "border-zinc-950 bg-zinc-950 text-white"
        : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400"
    }`;

  return (
    <main className="min-h-screen bg-zinc-50">
      {/* Heading */}
      <section className="border-b border-zinc-200 bg-white">
        <div className={`mx-auto max-w-full py-10 sm:py-14 ${GUTTER}`}>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-amber-700">
            Partner picks
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight text-zinc-950 sm:text-5xl">
            Affiliate products
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600 sm:text-base">
            Products we recommend from trusted partners. Each one opens on the
            partner&apos;s website, where you complete your purchase.
          </p>

          <div className="mt-6 flex max-w-2xl items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
            <FiInfo size={18} className="mt-0.5 shrink-0" />
            <p className="text-xs leading-5 sm:text-sm">
              Kairobuy may earn a commission when you buy through these links,
              at no extra cost to you. Price, stock, delivery, and returns are
              handled by the partner.{" "}
              <Link href="/terms" className="font-bold underline">
                Read our terms
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className={`mx-auto max-w-full pt-6 sm:pt-8 ${GUTTER}`}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <label className="relative block w-full lg:max-w-md">
            <span className="sr-only">Search affiliate products</span>
            <FiSearch
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, brand, or category"
              className="w-full rounded-full border border-zinc-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-950"
            />
          </label>

          <label className="flex items-center gap-3 text-sm font-bold text-zinc-700">
            Sort by
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="rounded-full border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold outline-none focus:border-zinc-950"
            >
              {sortOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {departments.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setDepartment(value)}
              className={chip(department === value)}
            >
              {departmentLabel(value)}
            </button>
          ))}
        </div>

        {partnerOptions.length > 2 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {partnerOptions.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setPartner(value)}
                className={chip(partner === value)}
              >
                {value}
              </button>
            ))}
          </div>
        )}

        <div className="mt-5 flex items-center justify-between text-sm text-zinc-500">
          <p>
            {visibleProducts.length} product
            {visibleProducts.length === 1 ? "" : "s"}
          </p>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1 font-bold text-zinc-950 hover:text-zinc-600"
            >
              <FiX size={14} />
              Clear filters
            </button>
          )}
        </div>
      </section>

      {/* Grid */}
      <section className={`mx-auto max-w-full py-6 sm:py-8 ${GUTTER}`}>
        {visibleProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
            {visibleProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-zinc-200 bg-white p-10 text-center sm:p-16">
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-zinc-100 text-zinc-700">
              <FiExternalLink size={24} />
            </div>

            <h2 className="mt-5 text-2xl font-black tracking-tight text-zinc-950">
              {initialProducts.length === 0
                ? "No affiliate products yet."
                : "No products match your filters."}
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
              {initialProducts.length === 0
                ? "Partner products will appear here as soon as they are added."
                : "Try a different search or clear your filters."}
            </p>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 inline-flex rounded-full bg-zinc-950 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-zinc-800"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </section>
    </main>
  );
}