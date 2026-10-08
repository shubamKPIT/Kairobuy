import AffiliateProductsClient from "./AffiliateProductsClient";
import { getProducts } from "../../lib/getProducts";

export const metadata = {
  title: "Affiliate Products",
  description:
    "Browse partner-linked products on Kairobuy. Each product opens on the partner's website.",
};

// Re-fetch at most once a minute
export const revalidate = 60;

export default async function AffiliateProductsPage() {
  let products = [];

  try {
    products = await getProducts({ affiliateOnly: true });
  } catch (error) {
    console.error("Affiliate products fetch error:", error);
  }

  return <AffiliateProductsClient initialProducts={products} />;
}