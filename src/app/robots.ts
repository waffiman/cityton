import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // The English legal pages are the same documents under a different prefix —
    // disallowing only the German paths left /en/impressum and /en/datenschutz
    // crawlable, which is the opposite of what the rule was for.
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/impressum", "/datenschutz", "/en/impressum", "/en/datenschutz"],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
