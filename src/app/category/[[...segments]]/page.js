import CategoryPageClient from "./CategoryPageClient";
import { getMediaOverrides } from "../../../lib/getMediaOverrides";
import { getProducts } from "../../../lib/getProducts";

// Re-fetch at most once a minute. Switch to
// `export const dynamic = "force-dynamic";` for data fresh on every request.
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

  const filters = {
    // "ALL" and "NEW" are not real departments
    department:
      departmentKey !== "ALL" && departmentKey !== "NEW"
        ? departmentKey
        : undefined,
    subcategory: subcategorySlug || undefined,
    newOnly: departmentSlug === "new",
  };

  let initialProducts = [];

  try {
    initialProducts = await getProducts(filters);
  } catch (error) {
    console.error("Category page product fetch error:", error);
  }

  return (
    <CategoryPageClient
      key={segments.join("/")}
      initialMediaOverrides={initialMediaOverrides}
      initialProducts={initialProducts}
    />
  );
}