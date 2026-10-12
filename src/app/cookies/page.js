import InfoPageLayout from "@/components/site/InfoPageLayout";

/*
  BEFORE PUBLISHING:
  - Replace [SUPPORT EMAIL].
  - Edit the "Types of cookies we use" list so it only names tools you
    actually use (analytics, ads, payment provider, etc.).
  - If you use analytics or marketing cookies, consider adding a cookie
    banner so visitors can accept or decline them before they are set.
  Then have a lawyer review it.
*/

const sections = [
  {
    title: "What are cookies?",
    body: [
      "Cookies are small files stored in your browser that help websites remember information and improve your browsing experience. We also use similar technologies, such as local storage, session storage, and pixels, which work in a comparable way. In this policy, “cookies” includes all of these.",
    ],
  },
  {
    title: "Why we use cookies",
    body: [
      "Kairobuy may use cookies for essential functionality, shopping-cart behaviour, login sessions, preferences, analytics, and security.",
    ],
  },
  {
    title: "Types of cookies we use",
    list: [
      "Essential cookies: needed for the site to work. They keep you signed in, hold items in your shopping bag, support checkout, and protect against fraud and security threats. These cannot be switched off in our systems.",
      "Preference cookies: remember choices such as your delivery location or pincode, and wishlist items, so you do not have to set them again.",
      "Analytics cookies: help us understand which pages are visited, how people move through the site, and where problems occur, so we can improve it. The information is used in aggregated form.",
      "Marketing cookies: used, where enabled, to measure the performance of our campaigns and to show offers that may interest you on other sites. We only use these if we tell you and, where required, with your consent.",
    ],
  },
  {
    title: "First-party and third-party cookies",
    body: [
      "First-party cookies are set by Kairobuy. Third-party cookies are set by other companies whose services we use, such as analytics providers, payment providers, or social platforms. These third parties have their own privacy and cookie policies, which we do not control.",
    ],
  },
  {
    title: "How long cookies last",
    body: [
      "Session cookies are deleted when you close your browser. Persistent cookies stay on your device for a set period, from a few days to up to two years, or until you delete them.",
    ],
  },
  {
    title: "Managing cookies",
    body: [
      "You can control cookies through your browser settings. Most browsers let you view, block, or delete cookies, and many let you block third-party cookies only. Disabling some cookies may affect cart, login, checkout, and other site features.",
      "Where we show a cookie banner or preference tool, you can use it to accept or decline non-essential cookies, and you can change your choice at any time. You can also opt out of some analytics and advertising cookies through the tools offered by those providers.",
    ],
  },
  {
    title: "Changes to this policy",
    body: [
      "We may update this Cookie Policy when our use of cookies changes or when the law requires. The “Last updated” date at the top of this page shows the latest version.",
    ],
  },
  {
    title: "More information",
    body: [
      "To learn how we handle personal information more broadly, see our Privacy Policy. For questions about cookies, contact Kairobuy Support using the Contact Us page or email [SUPPORT EMAIL].",
    ],
  },
];

export default function CookiesPage() {
  return (
    <InfoPageLayout
      eyebrow="Kairobuy Legal"
      title="Cookie Policy"
      description="How Kairobuy uses cookies and similar technologies."
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