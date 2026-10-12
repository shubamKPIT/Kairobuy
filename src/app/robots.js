export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kairobuy.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/api/admin/",
          "/api/auth/",
          "/api/orders/",
          "/api/payments/",
          "/api/users/",
          "/api/blob/",
          "/checkout",
          "/my-orders",
          "/wishlist",
          "/track-order",
          "/login",
          "/register",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}