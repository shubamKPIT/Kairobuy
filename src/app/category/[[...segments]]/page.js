import CategoryPageClient from "./CategoryPageClient";
import { getMediaOverrides } from "../../../lib/getMediaOverrides";
import { fetchProducts } from "../../../services/productService";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function CategoryPage({ params, searchParams }) {
  const initialMediaOverrides = await getMediaOverrides();

  // Unwrap params (it's a Promise in App Router)
  const resolvedParams = await params;

  const segments = Array.isArray(resolvedParams?.segments)
    ? resolvedParams.segments
    : resolvedParams?.segments
      ? [resolvedParams.segments]
      : ["all"];

  const departmentSlug = String(segments[0] || "all").toLowerCase();
  const subcategorySlug = segments[1]
    ? String(segments[1]).toLowerCase()
    : "";

  const departmentKeyMap = {
    men: "MEN",
    women: "WOMEN",
    kids: "KIDS",
    home: "HOME",
    accessories: "ACCESSORIES",
    all: "ALL",
    new: "NEW",
  };

  const departmentKey = departmentKeyMap[departmentSlug] || "ALL";

  const filters = {};

  if (departmentKey !== "ALL") {
    filters.department = departmentKey;
  }

  if (subcategorySlug) {
    filters.subcategory = subcategorySlug;
  }

  if (departmentSlug === "new") {
    filters.category = "new";
  }


let initialProducts = [];

try {
  const response = await fetchProducts(undefined, filters);
  const productList = response?.products || response || [];
  initialProducts = Array.isArray(productList) ? productList : [];
} catch (error) {
  console.error("Category page product fetch error:", error);
  initialProducts = [];
}

  return (
    <CategoryPageClient
      initialMediaOverrides={initialMediaOverrides}
      initialProducts={initialProducts}
    />
  );
}