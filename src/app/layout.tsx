import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { site } from "@/content/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "City-Ton Austria — Sonnenschutz- und Sicherheitsfolien",
    template: "%s · City-Ton Austria",
  },
  description: site.description,
  openGraph: {
    type: "website",
    locale: "de_AT",
    siteName: site.name,
    title: "City-Ton Austria — Sonnenschutz- und Sicherheitsfolien",
    description: site.description,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={inter.variable}>
      <body>
        <a className="skip-link" href="#inhalt">
          Zum Inhalt springen
        </a>
        <SiteHeader />
        <main id="inhalt">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
