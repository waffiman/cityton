import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SiteChrome from "@/components/SiteChrome";
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
    default: "City-Ton Austria - Sonnenschutz- und Sicherheitsfolien",
    template: "%s · City-Ton Austria",
  },
  icons: {
    icon: "/favicon.ico", // Default favicon
    shortcut: "/favicon-16x16.png", // Optional: smaller fallback
    apple: "/apple-touch-icon.png", // For iOS home screen shortcuts
    // You can also just use an array: icon: ['/favicon.ico', '/logo.svg']
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
        <SiteChrome header={<SiteHeader />} footer={<SiteFooter />}>
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
