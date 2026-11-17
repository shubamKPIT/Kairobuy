import { cache } from "react";
import { notFound, permanentRedirect } from "next/navigation";
import { connectDatabase } from "@/lib/db";
import Product from "@/models/Product";
import ProductPageClient from "./ProductPageClient";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kairobuy.com";

/*
  The folder is still called [id], but the value in the URL is now the
  product SLUG (/product/car-wash-shampoo).

  Old links that still contain a product ID (/product/6afae8f7...) keep
  working: the product is found by ID and the visitor is redirected to the
  slug URL.
*/
const OBJECT_ID_PATTERN = /^[a-f\d]{24}$/i;

function safeDecode(value) {
  try {
    return decodeURIComponent(String(value || "")).trim();
  } catch {
    return "";
  }
}

// cache() so metadata and page share one DB query per request
const getProduct = cache(async (idOrSlug) => {
  const value = safeDecode(idOrSlug);

  if (!value) return null;

  await connectDatabase();

  const query = OBJECT_ID_PATTERN.test(value)
    ? { _id: value, isActive: true }
    : { slug: value.toLowerCase(), isActive: true };

  const doc = await Product.findOne(query)
    .select("-vendor -amazon") // keep vendor/supplier details out of the page HTML
    .lean();

  // Convert ObjectId/Date values into plain JSON for the client component
  return doc ? JSON.parse(JSON.stringify(doc)) : null;
});

function getProductPath(product) {
  return `/product/${product.slug || product._id}`;
}

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
  const url = `${baseUrl}${getProductPath(product)}`;

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

  // Old ID links (or a different-case slug) go to the real slug URL
  if (product.slug && id !== product.slug) {
    permanentRedirect(getProductPath(product));
  }

  const isExternal =
    product.purchaseMode === "EXTERNAL_LINK" || product.source === "AMAZON";

  const images = [product.image, ...(product.images || [])].filter(Boolean);
  const url = `${baseUrl}${getProductPath(product)}`;

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