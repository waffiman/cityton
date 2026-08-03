"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";

/** Sets <html lang> to the active locale (root layout owns the html element). */
export function HtmlLang() {
  const locale = useLocale();
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return null;
}
