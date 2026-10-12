import HelpPageLayout from "@/components/site/HelpPageLayout";

/*
  BEFORE PUBLISHING, replace everything marked [BRACKETS] with your real
  numbers and details. Only keep promises you can actually meet:
  - [X-Y] processing and delivery days
  - [FREE SHIPPING THRESHOLD] and [SHIPPING FEE], or remove that line
  - [SUPPORT EMAIL]
  - Remove "Cash on delivery" and "International shipping" if not offered.
*/

const sections = [
  {
    title: "Order processing",
    body: [
      "Orders are generally processed after successful payment confirmation. Processing usually takes [X-Y] business days. Processing time may vary during sale events, holidays, or periods of unusually high demand.",
      "Business days are Monday to Saturday, excluding public holidays.",
    ],
  },
  {
    title: "Delivery timelines",
    body: [
      "Estimated delivery time depends on your location, the product, and the seller’s dispatch location. Most orders arrive within [X-Y] business days after dispatch. Remote or hard-to-reach areas may take longer.",
      "Delivery dates shown on the site or in emails are estimates, not guarantees. Delays can occur because of weather, courier disruptions, strikes, or other events outside our control.",
    ],
  },
  {
    title: "Delivery updates",
    body: [
      "Once your order is dispatched, you will receive shipment and tracking details through the contact information used while placing your order. You can also check your order status anytime on our Track Order page.",
    ],
  },
  {
    title: "Delivery locations",
    body: [
      "Delivery availability depends on your pincode, logistics coverage, product type, seller location, and inventory availability. Enter your pincode using Set location to check whether we can deliver to you. Some products may not be deliverable to every area.",
    ],
  },
  {
    title: "Shipping charges",
    body: [
      "Applicable shipping charges, if any, are shown during checkout before you complete payment. Orders above [FREE SHIPPING THRESHOLD] may qualify for free shipping. Otherwise a shipping fee of [SHIPPING FEE] may apply. Charges can vary by location and product, and promotional offers may change them.",
    ],
  },
  {
    title: "Orders with multiple items",
    body: [
      "If your order contains items from different sellers or warehouses, it may be shipped in separate parcels and arrive on different dates. You will receive tracking details for each shipment.",
    ],
  },
  {
    title: "Delivery attempts and incorrect addresses",
    body: [
      "Please provide a complete and accurate delivery address and a working phone number. The courier may contact you to coordinate delivery and will usually make more than one attempt. If delivery fails because of an incorrect address, an unreachable contact, or refusal to accept the parcel, the order may be returned to us, and we may charge for re-shipping or cancel the order.",
    ],
  },
  {
    title: "Checking your parcel",
    body: [
      "Please check the package on delivery. If it looks tampered with or damaged, or if an item is missing or wrong, tell us as soon as you can, ideally within [48 hours] of delivery, and keep the packaging and any photos. See our Returns page for the steps to follow.",
    ],
  },
  {
    title: "Lost or delayed orders",
    body: [
      "If your tracking shows no movement or your order has not arrived after the estimated delivery window, contact Kairobuy Support using the Contact Us page or email [SUPPORT EMAIL] with your order number. We will look into it with the courier and, if the parcel is confirmed lost, arrange a replacement or refund.",
    ],
  },
  {
    title: "Orders from external sellers",
    body: [
      "If you complete a purchase on an external seller or affiliate website, that seller’s own shipping terms apply, and we do not control their dispatch or delivery.",
    ],
  },
];

export default function ShippingPage() {
  return (
    <HelpPageLayout
      title="Shipping Information"
      description="Learn how Kairobuy processes, dispatches, and delivers your orders."
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
    </HelpPageLayout>
  );
}