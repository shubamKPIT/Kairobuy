import { cache } from "react";
import { notFound } from "next/navigation";
import mongoose from "mongoose";
import { connectDatabase } from "@/lib/db";
import Product from "@/models/Product";
import ProductPageClient from "./ProductPageClient";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kairobuy.com";

// cache() so metadata and page share one DB query per request
const getProduct = cache(async (id) => {
  if (!mongoose.isValidObjectId(id)) return null;

  await connectDatabase();

  const doc = await Product.findOne({ _id: id, isActive: true })
    .select("-vendor -amazon") // keep vendor/supplier details out of the page HTML
    .lean();

  // Convert ObjectId/Date values into plain JSON for the client component
  return doc ? JSON.parse(JSON.stringify(doc)) : null;
});

function getTotalStock(product) {
  const sizes = Array.isArray(product.sizes) ? product.sizes : [];
  return sizes.length > 0
    ? sizes.reduce((sum, s) => sum + Number(s.stock || 0), 0)
    : Number(product.stock || 0);
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return { title: "Product not found", robots: { index: false, follow: false } };
  }

  const title = product.name;
  const description = (
    product.shortDescription ||
    product.description ||
    `Buy ${product.name} online at Kairobuy.`
  )
    .replace(/\s+/g, " ")
    .slice(0, 160);

  const image = product.image || product.images?.[0];
  const url = `${baseUrl}/product/${product._id}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Kairobuy",
      type: "website",
      images: image ? [{ url: image }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : [],
    },
  };
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  const isExternal =
    product.purchaseMode === "EXTERNAL_LINK" || product.source === "AMAZON";

  const images = [product.image, ...(product.images || [])].filter(Boolean);
  const url = `${baseUrl}/product/${product._id}`;

  // Product structured data (real data only)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription || product.description || product.name,
    sku: String(product._id),
    brand: { "@type": "Brand", name: product.brand || "Kairobuy" },
    ...(images.length > 0 && { image: images }),
    ...(!isExternal &&
      Number(product.price) > 0 && {
        offers: {
          "@type": "Offer",
          url,
          priceCurrency: product.currency || "INR",
          price: Number(product.price),
          itemCondition: "https://schema.org/NewCondition",
          availability:
            getTotalStock(product) > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
        },
      }),
    ...(Number(product.reviewCount) > 0 &&
      Number(product.rating) > 0 && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: Number(product.rating),
          reviewCount: Number(product.reviewCount),
        },
      }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <ProductPageClient initialProduct={product} />
    </>
  );
}