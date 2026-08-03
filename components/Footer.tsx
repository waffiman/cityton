import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CONTACT } from "@/content/products";
import { PartnerLogoBlock } from "./PartnerLogoBlock";

const SITEMAP = [
  { href: "/", key: "home" as const },
  { href: "/about", key: "about" as const },
  { href: "/products", key: "products" as const },
  { href: "/how-it-works", key: "howItWorks" as const },
  { href: "/cases", key: "cases" as const },
  { href: "/blog", key: "blog" as const },
  { href: "/clients", key: "clients" as const },
  { href: "/partners", key: "partners" as const },
  { href: "/contact", key: "contact" as const },
];

export async function Footer() {
  const t = await getTranslations("footer");
  const tn = await getTranslations("nav");
  const year = new Date().getFullYear();

  return (
    <footer className="bg-dark-green text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4">
          <Image
            src="/brand/logo-header.png"
            alt="City-Ton Austria"
            width={140}
            height={48}
            className="h-10 w-auto brightness-0 invert"
          />
          <p className="text-sm leading-relaxed text-white/70">{t("tagline")}</p>
        </div>

        <div>
          <h2 className="text-sm font-semibold tracking-wide text-white/90 uppercase">
            {t("sitemapTitle")}
          </h2>
          <ul className="mt-4 space-y-2">
            {SITEMAP.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-white/70 transition hover:text-white"
                >
                  {tn(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold tracking-wide text-white/90 uppercase">
            {t("contactTitle")}
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li>
              <a
                href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                className="hover:text-white"
              >
                {t("phone")}
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACT.email}`} className="hover:text-white">
                {t("email")}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold tracking-wide text-white/90 uppercase">
            {t("partnersTitle")}
          </h2>
          <p className="mt-2 text-xs text-white/50">{t("inPartnership")}</p>
          <div className="mt-4 grid grid-cols-1 gap-3">
            <div className="rounded-xl bg-white/95 p-3">
              <PartnerLogoBlock partner="armolan" name="Armolan Europe" compact />
            </div>
            <div className="rounded-xl bg-white/95 p-3">
              <PartnerLogoBlock partner="llumar" name="LLumar" compact />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span>
            © {year} City-Ton Austria. {t("rights")}
          </span>
          <span>Armolan Europe · LLumar</span>
        </div>
      </div>
    </footer>
  );
}
