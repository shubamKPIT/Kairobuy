// Save as: src/app/api/reviews/route.js
import { NextResponse } from "next/server";
import { connectDatabase } from "../../../lib/db";
import Product from "../../../models/Product";
import Review from "../../../models/Review";

export const runtime = "nodejs";

const SORTS = {
  newest: { createdAt: -1 },
  highest: { rating: -1, createdAt: -1 },
  lowest: { rating: 1, createdAt: -1 },
};

function getProductImage(product) {
  // ASSUMPTION: change to match your Product image field(s)
  const first = product?.images?.[0] ?? product?.image;
  return typeof first === "string" ? first : first?.url || "";
}

/*
  Paginated reviews for the drawer.
  GET /api/reviews?limit=5&skip=0&sort=newest   (sort: newest | highest | lowest)
*/
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const limit = Math.min(
      20,
      Math.max(1, Math.floor(Number(searchParams.get("limit"))) || 5)
    );
    const skip = Math.max(0, Math.floor(Number(searchParams.get("skip"))) || 0);
    const sortBy = SORTS[searchParams.get("sort")] || SORTS.newest;

    await connectDatabase();

    // Hide reviews of products that are switched off
    const inactiveIds = await Product.find({ isActive: false }).distinct("_id");
    const filter = inactiveIds.length
      ? { productId: { $nin: inactiveIds } }
      : {};

    // Fetch one extra review just to know if there is a next page
    const [rows, stats] = await Promise.all([
      Review.find(filter).sort(sortBy).skip(skip).limit(limit + 1).lean(),
      skip === 0
        ? Review.aggregate([
            { $match: filter },
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
                average: { $avg: "$rating" },
              },
            },
          ])
        : Promise.resolve(null),
    ]);

    const hasMore = rows.length > limit;
    const pageRows = rows.slice(0, limit);

    const productIds = Array.from(
      new Set(pageRows.map((review) => String(review.productId)))
    );

    const products = await Product.find({ _id: { $in: productIds } })
      .select("name images image")
      .lean();

    const productMap = new Map(
      products.map((product) => [String(product._id), product])
    );

    const reviews = pageRows.map((review) => {
      const product = productMap.get(String(review.productId));

      return {
        _id: String(review._id),
        userName: review.userName,
        rating: review.rating,
        title: review.title,
        comment: review.comment,
        isVerifiedPurchase: review.isVerifiedPurchase,
        productId: String(review.productId),
        productName: product?.name || "",
        productImage: getProductImage(product),
        createdAt: review.createdAt,
      };
    });

    return NextResponse.json(
      {
        reviews,
        hasMore,
        // Totals are only sent with the first page
        ...(stats && {
          summary: {
            count: stats[0]?.count || 0,
            average: stats[0]?.average || 0,
          },
        }),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("REVIEWS ERROR:", error);

    return NextResponse.json(
      { message: error.message || "Unable to load reviews." },
      { status: 500 }
    );
  }
}