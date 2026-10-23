import "./globals.css";
import AppProviders from "../context/AppProviders";
import StorefrontShell from "../components/layout/StorefrontShell";
import { Jost } from "next/font/google";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import PromoCard from "@/components/layout/PromoCard";

const mainFont = Jost({
  subsets: ["latin"],
  variable: "--font-main",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://kairobuy.com"),
  title: {
    default: "Kairobuy",
    template: "%s | Kairobuy",
  },
  description: "A modern shopping experience.",
  verification: {
    google: "nk_QiSqNncqxTWMVF0mWdz3H71oB9K4e852NybTMCE8",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={mainFont.variable}>
      <body>
        <AppProviders>
          <StorefrontShell>{children}</StorefrontShell>
          <WhatsAppButton />
          <PromoCard />
        </AppProviders>
      </body>
    </html>
  );
}