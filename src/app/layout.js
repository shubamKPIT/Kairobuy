import "./globals.css";
import AppProviders from "../context/AppProviders";
import StorefrontShell from "../components/layout/StorefrontShell";

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
    <html lang="en">
      <body>
        <AppProviders>
          <StorefrontShell>{children}</StorefrontShell>
        </AppProviders>
      </body>
    </html>
  );
}