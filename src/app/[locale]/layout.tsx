import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Inter } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SiteChrome from "@/components/SiteChrome";
import { routing } from "@/i18n/routing";
import { site } from "@/content/site";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site" });

  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${site.name} - ${t("titleTagline")}`,
      template: `%s · ${site.name}`,
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon-16x16.png",
      apple: "/apple-touch-icon.png",
    },
    description: t("description"),
    openGraph: {
      type: "website",
      locale: locale === "de" ? "de_AT" : "en_US",
      siteName: site.name,
      title: `${site.name} — ${t("titleTagline")}`,
      description: t("description"),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Enables static rendering for this locale where pages opt into it.
  setRequestLocale(locale);

  return (
    <html lang={locale} className={inter.variable}>
      <body>
        <NextIntlClientProvider>
          <SiteChrome header={<SiteHeader />} footer={<SiteFooter />}>
            {children}
          </SiteChrome>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
