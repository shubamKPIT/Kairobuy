import { connectDatabase } from "@/lib/db";
import Product from "@/models/Product";
import { departmentData } from "@/data/departmentData";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kairobuy.com";
const PRODUCT_URL_FIELD = "id";

// Rebuild the sitemap at most once per hour
export const revalidate = 3600;

export default async function sitemap() {
  const now = new Date();

  // 1. Static pages
  const staticPages = [
    { path: "", priority: 1.0, changeFrequency: "daily" },
    { path: "/shipping", priority: 0.3, changeFrequency: "yearly" },
    { path: "/returns", priority: 0.3, changeFrequency: "yearly" },
    { path: "/size-guide", priority: 0.3, changeFrequency: "yearly" },
    { path: "/contact", priority: 0.3, changeFrequency: "yearly" },
    { path: "/privacy-policy", priority: 0.2, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
    { path: "/cookies", priority: 0.2, changeFrequency: "yearly" },
    // { path: "/affiliate-disclosure", priority: 0.2, changeFrequency: "yearly" },
  ].map(({ path, priority, changeFrequency }) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  // 2. Category pages, built from departmentData.js
  const categoryPages = [];

  Object.values(departmentData).forEach((department) => {
    categoryPages.push({
      url: `${baseUrl}/category/${department.slug}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    });

    department.subcategories.forEach((sub) => {
      categoryPages.push({
        url: `${baseUrl}/category/${department.slug}/${sub.slug}`,
        lastModified: now,
        changeFrequency: "daily",
        priority: 0.8,
      });
    });
  });

  // 3. Product pages from MongoDB
  let productPages = [];

  try {
    await connectDatabase();

    const products = await Product.find({ isActive: true }, "_id slug updatedAt").lean();

    productPages = products.map((p) => {
      const identifier = PRODUCT_URL_FIELD === "slug" ? p.slug : String(p._id);

      return {
        url: `${baseUrl}/product/${identifier}`,
        lastModified: p.updatedAt || now,
        changeFrequency: "weekly",
        priority: 0.7,
      };
    });
  } catch (error) {
    console.error("Sitemap: could not load products", error);
  }

  return [...staticPages, ...categoryPages, ...productPages];
}