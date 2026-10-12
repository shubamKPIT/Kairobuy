import Link from "next/link";
import InfoPageLayout from "@/components/site/InfoPageLayout";

export const metadata = {
  title: "Affiliate Disclosure | Kairobuy",
  description:
    "Kairobuy is committed to transparency. Learn how affiliate links on our site work and how we may earn a commission at no extra cost to you.",
  alternates: { canonical: "/affiliate-disclosure" },
  openGraph: {
    title: "Affiliate Disclosure | Kairobuy",
    description:
      "Learn how affiliate links work on Kairobuy and how we may earn a commission at no extra cost to you.",
    url: "/affiliate-disclosure",
    siteName: "Kairobuy",
    type: "article",
  },
};

const SUPPORT_EMAIL = "support@kairobuy.com";

const sections = [
  {
    title: "What are affiliate links?",
    body: [
      "Some links on Kairobuy are affiliate links. If you click one and make a purchase on a partner's website, we may earn a commission at no additional cost to you. These commissions help us maintain and grow Kairobuy.",
    ],
  },
  {
    title: "Our commitment to honesty",
    body: [
      "We aim to feature products and collections that we believe will be useful to our visitors. Affiliate partnerships do not determine our product descriptions or recommendations. We strive to provide honest and helpful information so visitors can make informed decisions.",
    ],
  },
  {
    title: "Why we use affiliate links",
    body: [
      "Affiliate links help cover the costs of operating Kairobuy, allowing us to maintain and improve the browsing experience for our visitors.",
    ],
  },
  {
    title: "Purchases on partner websites",
    body: [
      "When you click through to a partner website, your purchase, payment, delivery, returns, and customer support are handled by that retailer under its own terms and privacy policy. Prices and product availability may change after you leave Kairobuy.",
    ],
  },
  {
    title: "Your responsibility",
    body: [
      "Please review product details, pricing, seller information, and applicable policies before making a purchase. Information on Kairobuy is provided for general informational purposes and should not be treated as professional advice.",
    ],
  },
];

export default function AffiliateDisclosurePage() {
  return (
    <InfoPageLayout
      eyebrow="Kairobuy Legal"
      title="Affiliate Disclosure"
      description="Learn how affiliate links work on Kairobuy and how we maintain transparency when recommending products."
      updatedAt="October 12, 2026"
    >
      {sections.map((section) => (
        <section key={section.title}>
          <h2 className="text-xl font-black text-zinc-950">
            {section.title}
          </h2>

          {section.body.map((paragraph, i) => (
            <p key={i} className="mt-3">
              {paragraph}
            </p>
          ))}
        </section>
      ))}

      <section>
        <h2 className="text-xl font-black text-zinc-950">
          Questions?
        </h2>

        <p className="mt-3">
          If you have questions about this disclosure or our affiliate
          partnerships, contact us at{" "}
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="font-medium underline underline-offset-4"
          >
            {SUPPORT_EMAIL}
          </a>{" "}
          or visit our{" "}
          <Link
            href="/contact"
            className="font-medium underline underline-offset-4"
          >
            Contact Us
          </Link>{" "}
          page.
        </p>
      </section>

      <p className="border-t border-zinc-200 pt-6 font-medium text-zinc-950">
        Thank you for supporting Kairobuy!
      </p>
    </InfoPageLayout>
  );
}

