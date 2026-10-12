import InfoPageLayout from "@/components/site/InfoPageLayout";

/*
  BEFORE PUBLISHING, replace everything marked [BRACKETS]:
  - [LEGAL ENTITY NAME] and [REGISTERED ADDRESS]
  - [SUPPORT EMAIL]
  - [GRIEVANCE OFFICER NAME / EMAIL]
  - the payment provider and analytics names, to match what you actually use
  Then have a lawyer review it.
*/

const sections = [
  {
    title: "Who we are",
    body: [
      "Kairobuy (“Kairobuy”, “we”, “us”) operates the website kairobuy.com, an online store for fashion, footwear, home essentials, accessories, and related products. Kairobuy is operated by [LEGAL ENTITY NAME], [REGISTERED ADDRESS].",
      "This Privacy Policy explains what personal information we collect, why we collect it, how we use and protect it, and the choices you have. By using Kairobuy, you agree to this policy.",
    ],
  },
  {
    title: "Information we collect",
    intro: "Depending on how you use Kairobuy, we may collect:",
    list: [
      "Account details: name, email address, phone number, and password (stored in encrypted form).",
      "Order details: items purchased, delivery and billing addresses, order history, and return or refund requests.",
      "Payment details: payments are handled by our payment providers. We receive confirmation of payment status and limited details such as the payment method type, but we do not store your full card number, CVV, or UPI PIN.",
      "Cart and wishlist: items you add to your shopping bag or wishlist.",
      "Location: the delivery location or pincode you set on the site, so we can show availability and delivery estimates. We do not collect precise device location unless you allow it.",
      "Communications: messages you send to support, and your preferences if you subscribe to updates or offers.",
      "Reviews and feedback: ratings, reviews, or testimonials you choose to submit.",
      "Device and usage data: IP address, browser type, device type, pages viewed, referring pages, and approximate location derived from your IP address, collected through cookies and similar technologies.",
    ],
  },
  {
    title: "How we use information",
    intro: "We use your information to:",
    list: [
      "Create and manage your account.",
      "Process orders, payments, deliveries, returns, and refunds, and let you track your orders.",
      "Provide customer support and respond to your requests.",
      "Send order confirmations, shipping updates, and other service messages.",
      "Send marketing messages about offers and new drops, where you have opted in. You can unsubscribe at any time.",
      "Personalise your experience, such as remembering your cart and wishlist.",
      "Detect, investigate, and prevent fraud, abuse, and security incidents.",
      "Understand how the site is used so we can fix problems and improve our products and services.",
      "Comply with legal, tax, and regulatory obligations and enforce our Terms.",
    ],
  },
  {
    title: "Consent and legal basis",
    body: [
      "We process your personal information where you have given consent (for example, signing up for marketing messages), where it is necessary to fulfil your order or provide a service you requested, or where the law requires or permits it. You can withdraw consent at any time by contacting us, though this will not affect processing already carried out and may limit some features of the site.",
    ],
  },
  {
    title: "Sharing information",
    intro: "We do not sell your personal information. We share it only as needed with:",
    list: [
      "Payment providers, to process your payments and prevent payment fraud.",
      "Delivery and logistics partners, to ship your orders and handle returns.",
      "Sellers and brand partners, where an order is fulfilled by them, limited to what is needed to deliver your order.",
      "Service providers, such as hosting, analytics, email, SMS, customer support, and security tools, who act on our instructions.",
      "Authorities, courts, or regulators, where required by law or to protect rights, safety, and property.",
      "A buyer or successor, if Kairobuy is involved in a merger, acquisition, or sale of assets. We will tell you if this changes how your information is handled.",
    ],
  },
  {
    title: "Affiliate links",
    body: [
      "Some products or links on Kairobuy may be affiliate links. If you click one and leave our site, the third party’s own privacy policy applies to the information they collect. See our Affiliate Disclosure for details.",
    ],
  },
  {
    title: "Cookies and similar technologies",
    body: [
      "We use cookies and similar technologies to keep the site working (for example, to remember your cart and keep you signed in), to understand how the site is used, and to measure our marketing. You can control cookies through your browser settings, though blocking some cookies may affect how the site works. See our Cookies page for more detail.",
    ],
  },
  {
    title: "How long we keep information",
    body: [
      "We keep personal information only as long as needed for the purposes described in this policy, including to meet legal, accounting, and tax requirements and to resolve disputes. Order records are generally retained for the period required by law. When information is no longer needed, we delete it or anonymise it.",
    ],
  },
  {
    title: "How we protect information",
    body: [
      "We use reasonable technical and organisational safeguards, including encrypted connections (HTTPS), access controls, and secure payment processing. No online service can be completely secure, so we cannot guarantee absolute security. Please use a strong, unique password and keep it private.",
    ],
  },
  {
    title: "Your choices and rights",
    intro: "Subject to applicable law, you may:",
    list: [
      "Ask to access the personal information we hold about you.",
      "Ask us to correct inaccurate or incomplete information.",
      "Ask us to delete your information or close your account, subject to records we must legally keep.",
      "Withdraw consent for marketing or other optional processing.",
      "Unsubscribe from marketing emails using the link in any email, or by contacting us.",
      "Raise a complaint about how your information is handled.",
    ],
    after:
      "To make a request, contact us using the details below. We may need to verify your identity first.",
  },
  {
    title: "Children’s privacy",
    body: [
      "Kairobuy sells products for children, but our services are intended for adults. We do not knowingly collect personal information from anyone under 18 without verifiable consent from a parent or guardian. If you believe a child has given us personal information, contact us and we will delete it.",
    ],
  },
  {
    title: "Storage and transfers",
    body: [
      "Your information may be processed and stored on servers, or by service providers, located outside your own state or country. Where this happens, we take steps to make sure it is handled in line with this policy and applicable law.",
    ],
  },
  {
    title: "Third-party sites",
    body: [
      "Kairobuy may link to third-party websites and social platforms (such as Instagram, Facebook, Twitter, and YouTube). We are not responsible for their content or privacy practices. Please review their policies before sharing information with them.",
    ],
  },
  {
    title: "Changes to this policy",
    body: [
      "We may update this policy from time to time. When we do, we will change the “Last updated” date at the top of this page and, for significant changes, take additional steps to notify you. Continued use of Kairobuy after an update means you accept the revised policy.",
    ],
  },
  {
    title: "Contact and grievances",
    body: [
      "For privacy questions or to exercise your rights, contact Kairobuy Support using the Contact Us page or email [SUPPORT EMAIL].",
      "Grievance Officer: [GRIEVANCE OFFICER NAME], [GRIEVANCE OFFICER EMAIL]. We aim to acknowledge complaints promptly and resolve them within the time required by law.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <InfoPageLayout
      eyebrow="Kairobuy Legal"
      title="Privacy Policy"
      description="How Kairobuy collects, uses, stores, and protects customer information."
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

          {section.after && <p className="mt-3">{section.after}</p>}
        </section>
      ))}
    </InfoPageLayout>
  );
}