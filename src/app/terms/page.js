import InfoPageLayout from "@/components/site/InfoPageLayout";

/*
  BEFORE PUBLISHING, replace everything marked [BRACKETS]:
  - [LEGAL ENTITY NAME] and [REGISTERED ADDRESS]
  - [SUPPORT EMAIL]
  - [GOVERNING LAW / COUNTRY] and [CITY] for the courts
  Then have a lawyer review it.
*/

const sections = [
  {
    title: "Acceptance of these terms",
    body: [
      "These Terms of Service (“Terms”) govern your use of kairobuy.com and the services offered through it (“Kairobuy”, “we”, “us”). Kairobuy is operated by [LEGAL ENTITY NAME], [REGISTERED ADDRESS].",
      "By accessing or using Kairobuy, browsing the site, creating an account, or placing an order, you agree to these Terms and to our Privacy Policy. If you do not agree, please do not use the platform.",
    ],
  },
  {
    title: "Using Kairobuy",
    body: [
      "You agree to use the platform lawfully and to provide accurate, current information when creating an account or placing an order.",
    ],
    intro: "You agree not to:",
    list: [
      "Use Kairobuy for any unlawful, fraudulent, or abusive purpose.",
      "Interfere with the site’s security or operation, including through bots, scraping, or automated purchasing.",
      "Attempt to access accounts, systems, or data you are not authorised to access.",
      "Upload malicious code or submit false, misleading, or infringing content.",
      "Resell products bought on Kairobuy commercially without our written permission.",
    ],
  },
  {
    title: "Eligibility",
    body: [
      "You must be at least 18 years old, or the age of majority where you live, and legally able to enter into a contract to place orders. If you are younger, you may use Kairobuy only with the involvement and consent of a parent or guardian.",
    ],
  },
  {
    title: "Your account",
    body: [
      "You are responsible for keeping your login details confidential and for all activity under your account. Tell us promptly if you suspect unauthorised use. We may suspend or close accounts that provide false information, breach these Terms, or put the platform or other users at risk.",
    ],
  },
  {
    title: "Product information",
    body: [
      "We aim to keep product descriptions, images, pricing, and availability accurate. However, product details may change, errors can occur, and display colours can vary between screens. Size guides are provided as a general reference, and small differences in measurements may occur.",
    ],
  },
  {
    title: "Pricing and availability",
    body: [
      "Prices are shown in Indian rupees (₹) unless stated otherwise and include applicable taxes unless noted. Delivery charges, if any, are shown before you confirm your order. Products are subject to availability. If we find a pricing or listing error, we may correct it and cancel affected orders, in which case you will be refunded in full for any amount paid.",
    ],
  },
  {
    title: "Orders and payment",
    body: [
      "Placing an order is an offer to buy. An order is accepted only when we confirm it or dispatch the product. We may decline or cancel an order, for example because of stock issues, pricing errors, suspected fraud, or an address we cannot deliver to.",
      "Payments are processed by third-party payment providers. By paying, you confirm that you are authorised to use the payment method. Your use of a payment provider may also be subject to that provider’s own terms.",
    ],
  },
  {
    title: "Shipping, returns, and refunds",
    body: [
      "Delivery timelines, return eligibility, and refund timing are described on our Shipping and Returns pages, which form part of these Terms. Delivery dates are estimates and may be affected by factors outside our control.",
    ],
  },
  {
    title: "External products",
    body: [
      "Some products may link to external seller or affiliate websites. Purchases completed outside Kairobuy are governed by that seller’s own pricing, shipping, payment, and return policies. We do not control those sites and are not a party to those transactions. We may earn a commission on qualifying purchases, as explained in our Affiliate Disclosure.",
    ],
  },
  {
    title: "Offers and promotions",
    body: [
      "Discounts, sale prices, and promotional offers are available for a limited time and may be subject to additional conditions. We may change or withdraw an offer at any time, and offers cannot be combined unless stated.",
    ],
  },
  {
    title: "Reviews and user content",
    body: [
      "If you submit reviews, ratings, or other content, you confirm that it is truthful, that it is yours to share, and that it does not break the law or infringe anyone’s rights. You give Kairobuy a non-exclusive, royalty-free licence to display, reproduce, and adapt that content on our platform and in our marketing. We may remove content at our discretion.",
    ],
  },
  {
    title: "Intellectual property",
    body: [
      "The Kairobuy name, logo, site design, text, graphics, and other materials are owned by us or our licensors and are protected by intellectual property laws. Brand names and product images belong to their respective owners. You may not copy, modify, distribute, or use them without prior written permission, except for your personal, non-commercial use of the site.",
    ],
  },
  {
    title: "Third-party links and services",
    body: [
      "Kairobuy may contain links to third-party websites, social platforms, and services. We do not endorse or control them and are not responsible for their content, products, or privacy practices.",
    ],
  },
  {
    title: "Disclaimers",
    body: [
      "Kairobuy is provided on an “as is” and “as available” basis. To the extent permitted by law, we do not guarantee that the site will be uninterrupted, error-free, or secure. Nothing in these Terms limits any rights you have under applicable consumer protection laws.",
    ],
  },
  {
    title: "Limitation of liability",
    body: [
      "To the extent permitted by law, Kairobuy and its owners, employees, and partners are not liable for indirect, incidental, special, or consequential losses arising from your use of the platform. Our total liability for any claim relating to an order is limited to the amount you paid for that order. Nothing in these Terms excludes liability that cannot be excluded by law.",
    ],
  },
  {
    title: "Indemnity",
    body: [
      "You agree to compensate Kairobuy for losses, claims, and expenses arising from your breach of these Terms, your misuse of the platform, or your violation of any law or third-party right.",
    ],
  },
  {
    title: "Suspension and termination",
    body: [
      "We may suspend or end your access to Kairobuy at any time if you breach these Terms or if required by law. You may stop using the platform or ask us to close your account at any time. Provisions that by their nature should survive termination, such as intellectual property, disclaimers, and liability limits, will continue to apply.",
    ],
  },
  {
    title: "Governing law and disputes",
    body: [
      "These Terms are governed by the laws of [GOVERNING LAW / COUNTRY]. Please contact us first so we can try to resolve any dispute informally. If we cannot, the courts at [CITY] will have jurisdiction, subject to any rights you have under mandatory consumer protection laws.",
    ],
  },
  {
    title: "Changes to these terms",
    body: [
      "Kairobuy may update these terms when required. The “Last updated” date at the top of this page shows the latest version. Continued use after an update means you accept the revised version.",
    ],
  },
  {
    title: "Contact",
    body: [
      "For questions about these Terms, contact Kairobuy Support using the Contact Us page or email [SUPPORT EMAIL].",
    ],
  },
];

export default function TermsPage() {
  return (
    <InfoPageLayout
      eyebrow="Kairobuy Legal"
      title="Terms of Service"
      description="Rules and conditions for using Kairobuy and purchasing products through the platform."
      updatedAt="October 12, 2026"
    >
      {sections.map((section) => (
        <section key={section.title}>
          <h2 className="text-xl font-black text-zinc-950">
            {section.title}
          </h2>

          {section.body?.map((paragraph, i) => (
            <p key={i} className="mt-3">
              {paragraph}
            </p>
          ))}

          {section.intro && <p className="mt-3">{section.intro}</p>}

          {section.list && (
            <ul className="mt-3 list-disc space-y-2 pl-5">
              {section.list.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </InfoPageLayout>
  );
}