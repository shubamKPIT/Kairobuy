import Link from "next/link";

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

// TODO: replace with your real support email
const SUPPORT_EMAIL = "support@kairobuy.com";

const sections = [
  {
    title: "What are affiliate links?",
    body: [
      "Some of the links on Kairobuy are affiliate links. If you click one and make a purchase on the partner's website, we may earn a small commission at no additional cost to you. These commissions help us maintain and grow Kairobuy.",
    ],
  },
  {
    title: "Our commitment to honesty",
    body: [
      "We only feature products and collections we believe will be useful to our visitors. Affiliate partnerships do not influence which products we show or how we describe them. Our selections and opinions are our own.",
    ],
  },
  {
    title: "Why we use affiliate links",
    body: [
      "Affiliate links help cover the costs of running Kairobuy, so we can keep the browsing experience free for everyone.",
    ],
  },
  {
    title: "Purchases on partner websites",
    body: [
      "When you click through to a partner site, your purchase, payment, delivery, returns, and support are handled by that retailer under its own terms and privacy policy. Prices and availability may change on the partner site after you leave Kairobuy.",
    ],
  },
  {
    title: "Your responsibility",
    body: [
      "Please do your own research before making a purchase. Information on Kairobuy is for general purposes and should not be treated as professional advice.",
    ],
  },
];

export default function AffiliateDisclosurePage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-neutral-500">
        <Link href="/" className="hover:text-neutral-900 hover:underline">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-neutral-900">Affiliate Disclosure</span>
      </nav>

      <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
        Affiliate Disclosure
      </h1>
      <p className="mt-4 text-base leading-7 text-neutral-600">
        At <strong className="text-neutral-900">Kairobuy</strong>, we believe in
        being open with our visitors. This page explains the affiliate links and
        partnerships on our website.
      </p>

      <div className="mt-10 space-y-8">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-xl font-semibold text-neutral-900">
              {section.title}
            </h2>
            {section.body.map((text, i) => (
              <p key={i} className="mt-2 text-base leading-7 text-neutral-600">
                {text}
              </p>
            ))}
          </section>
        ))}

        <section>
          <h2 className="text-xl font-semibold text-neutral-900">Questions?</h2>
          <p className="mt-2 text-base leading-7 text-neutral-600">
            If you have any questions about this disclosure or our
            recommendations, email us at{" "}
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="font-medium text-neutral-900 underline underline-offset-4"
            >
              {SUPPORT_EMAIL}
            </a>{" "}
            or visit our{" "}
            <Link
              href="/contact"
              className="font-medium text-neutral-900 underline underline-offset-4"
            >
              contact page
            </Link>
            .
          </p>
        </section>
      </div>

      <p className="mt-12 border-t border-neutral-200 pt-6 text-base font-medium text-neutral-900">
        Thank you for supporting Kairobuy!
      </p>
    </main>
  );
}