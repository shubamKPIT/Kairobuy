import CategoryPageClient from "./CategoryPageClient";
import { getMediaOverrides } from "../../../lib/getMediaOverrides";
import { fetchProducts } from "../../../services/productService";

// Re-fetch at most once a minute. Switch back to
// `export const dynamic = "force-dynamic";` if you need data fresh on every request.
export const revalidate = 60;

const departmentKeyMap = {
  men: "MEN",
  women: "WOMEN",
  kids: "KIDS",
  home: "HOME",
  accessories: "ACCESSORIES",
  all: "ALL",
  new: "NEW",
};

export default async function CategoryPage({ params }) {
  // params is a Promise in the App Router; fetch it alongside media overrides
  const [initialMediaOverrides, resolvedParams] = await Promise.all([
    getMediaOverrides(),
    params,
  ]);

  const segments = Array.isArray(resolvedParams?.segments)
    ? resolvedParams.segments
    : resolvedParams?.segments
      ? [resolvedParams.segments]
      : ["all"];

  const departmentSlug = String(segments[0] || "all").toLowerCase();
  const subcategorySlug = segments[1] ? String(segments[1]).toLowerCase() : "";

  const departmentKey = departmentKeyMap[departmentSlug] || "ALL";

  const filters = {};

  // "ALL" and "NEW" are not real departments, so don't filter by them
  if (departmentKey !== "ALL" && departmentKey !== "NEW") {
    filters.department = departmentKey;
  }

  if (subcategorySlug) {
    filters.subcategory = subcategorySlug;
  }

  if (departmentSlug === "new") {
    // Make sure this matches the field your fetchProducts expects
    // (the client reads product.newCategory === "new")
    filters.category = "new";
  }

  let initialProducts = [];

  try {
    const response = await fetchProducts(undefined, filters);
    const productList = response?.products || response || [];
    initialProducts = Array.isArray(productList) ? productList : [];
  } catch (error) {
    console.error("Category page product fetch error:", error);
  }

  return (
    <CategoryPageClient
      // Remount per route so product and filter state never go stale
      key={segments.join("/")}
      initialMediaOverrides={initialMediaOverrides}
      initialProducts={initialProducts}
    />
  );
}