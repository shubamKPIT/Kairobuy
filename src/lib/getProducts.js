import { connectDatabase } from "./db";
import Product from "../models/Product";

/**
 * Server-only product query. Same filtering rules as /api/products,
 * but runs directly against the database (no HTTP call, no in-memory cache).
 */
export async function getProducts({
  department,
  subcategory,
  newOnly,
  affiliateOnly,
} = {}) {
  await connectDatabase();

  const filter = {
    // keeps legacy products visible, same as the API route
    isActive: { $ne: false },
  };

  if (department) {
    filter.department = String(department).toUpperCase();
  }

  if (subcategory) {
    filter.subcategory = String(subcategory).toLowerCase();
  }

  if (newOnly) {
    filter.newCategory = "new";
  }

  // Affiliate / external products: they link out to a partner site
  // instead of going through Kairobuy checkout.
  if (affiliateOnly) {
    filter.$or = [{ purchaseMode: "EXTERNAL_LINK" }, { source: "AMAZON" }];
  }

  const products = await Product.find(filter)
    .sort({ isFeatured: -1, createdAt: -1 })
    .lean();

  // lean() returns ObjectId/Date objects, which can't be passed to a
  // Client Component. Convert to plain JSON-safe data.
  return JSON.parse(JSON.stringify(products));
}