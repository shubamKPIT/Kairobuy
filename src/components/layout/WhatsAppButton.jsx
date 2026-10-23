"use client";

import { FaWhatsapp } from "react-icons/fa";

/*
  Floating WhatsApp button (click-to-chat). No API key needed.

  Set your number in .env.local (country code + number, digits only):
  NEXT_PUBLIC_WHATSAPP_NUMBER=919876543210
*/

const PHONE = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210";
const DEFAULT_MESSAGE = "Hi Kairobuy, I need help with my order.";

export default function WhatsAppButton({
  phone = PHONE,
  message = DEFAULT_MESSAGE,
}) {
  const href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed bottom-5 right-5 z-40 flex items-center gap-0.25 rounded-full bg-[#128c2c] p-1.5 text-white shadow-lg shadow-black/25 transition hover:scale-105 hover:shadow-xl sm:bottom-6 sm:right-6"
    >
      <FaWhatsapp size={40} />
      <span className="hidden max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-all duration-300 group-hover:max-w-40 group-hover:pr-1 sm:inline">
        Chat with us
      </span>
    </a>
  );
}