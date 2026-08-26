"use client";

/**
 * GDPR consent gate for Google Analytics (GA4 via gtag.js).
 *
 * Nothing analytics-related loads until the visitor actively accepts —
 * the <GoogleAnalytics> script tag is only mounted after consent is
 * "granted". The choice is remembered in localStorage; declining (or not
 * deciding) means zero GA requests, consistent with the Datenschutz page.
 */

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { GoogleAnalytics } from "@next/third-parties/google";
import styles from "./CookieConsent.module.css";
import { Link } from "@/i18n/navigation";

const STORAGE_KEY = "cityton-analytics-consent";
const GA_ID = "G-H9QJHE6NX6";

type Consent = "granted" | "denied" | null;

export default function CookieConsent() {
  const t = useTranslations("cookieConsent");
  const [consent, setConsent] = useState<Consent>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      // Private browsing / blocked storage: treat as undecided each visit.
    }
    if (stored === "granted" || stored === "denied") setConsent(stored);
    setReady(true);
  }, []);

  const decide = (value: "granted" | "denied") => {
    setConsent(value);
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Nothing to persist if storage is unavailable; banner just reappears.
    }
  };

  return (
    <>
      {consent === "granted" && <GoogleAnalytics gaId={GA_ID} />}
      {ready && consent === null && (
        <div className={styles.banner} role="dialog" aria-live="polite" aria-label={t("title")}>
          <p className={styles.copy}>
            {t("body")}{" "}
            <Link href="/datenschutz">{t("privacyLink")}</Link>
          </p>
          <div className={styles.actions}>
            <button
              type="button"
              className={`btn ${styles.declineBtn}`}
              onClick={() => decide("denied")}
            >
              {t("decline")}
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => decide("granted")}
            >
              {t("accept")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
