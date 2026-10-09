"use client";

import HelpPageLayout from "@/components/site/HelpPageLayout";
import { FiMail, FiMessageCircle, FiPhone, FiSend } from "react-icons/fi";

const SUPPORT_EMAIL = "support@kairobuy.example";

const orderMailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
  "Order query",
)}&body=${encodeURIComponent(
  "Hi KairoBuy team,\n\nOrder number: \nMy question: \n\nThanks,",
)}`;

export default function ContactPage() {
  return (
    <HelpPageLayout
      title="Contact Us"
      description="Need help with a product, order, payment, return, or delivery question? Send us an email and we'll get back to you."
    >
      <section className="grid gap-4 sm:grid-cols-3">
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 transition hover:border-zinc-950"
        >
          <FiMail size={20} className="text-amber-700" />
          <h2 className="mt-3 text-sm font-black text-zinc-950">
            Email support
          </h2>
          <p className="mt-2 text-sm text-zinc-600">{SUPPORT_EMAIL}</p>
        </a>

        <a
          href="tel:+910000000000"
          className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 transition hover:border-zinc-950"
        >
          <FiPhone size={20} className="text-amber-700" />
          <h2 className="mt-3 text-sm font-black text-zinc-950">
            Phone support
          </h2>
          <p className="mt-2 text-sm text-zinc-600">
            Add your support number
          </p>
        </a>

        <a
          href={orderMailto}
          className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 transition hover:border-zinc-950"
        >
          <FiMessageCircle size={20} className="text-amber-700" />
          <h2 className="mt-3 text-sm font-black text-zinc-950">
            Order support
          </h2>
          <p className="mt-2 text-sm text-zinc-600">
            Include your order number.
          </p>
        </a>
      </section>

      <section>
        <h2 className="text-xl font-black text-zinc-950">
          Have a question? Email us
        </h2>

        <p className="mt-3 text-sm text-zinc-600">
          Write to us at{" "}
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="font-bold text-zinc-950 underline"
          >
            {SUPPORT_EMAIL}
          </a>
          . To help us resolve your query faster, please include:
        </p>

        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-600">
          <li>Your name and the email address used on your order</li>
          <li>Your order number, if your question is about an order</li>
          <li>A clear description of the issue, with photos if relevant</li>
        </ul>

        <a
          href={orderMailto}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-zinc-800"
        >
          <FiSend size={16} />
          Email us
        </a>
      </section>
    </HelpPageLayout>
  );
}