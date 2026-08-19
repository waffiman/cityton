"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

/**
 * Read directly rather than importing from lib/turnstile: that module is
 * server-side (it holds the secret-key logic) and must stay out of this bundle.
 * NEXT_PUBLIC_* is inlined at build time, so this must be a literal member
 * access — a computed lookup would not be replaced.
 */
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          appearance?: "always" | "execute" | "interaction-only";
          size?: "normal" | "flexible" | "compact";
        },
      ) => string;
      reset: (id?: string) => void;
    };
  }
}

/**
 * Invisible Cloudflare Turnstile. Renders nothing visible in the common case —
 * `interaction-only` means a challenge appears solely when Cloudflare decides a
 * visitor needs one, so the form layout is unaffected.
 *
 * Renders null entirely when no site key is configured, so the forms keep
 * working on a deploy without keys.
 */
export default function TurnstileWidget({
  onToken,
}: {
  onToken: (token: string | null) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const [ready, setReady] = useState(false);
  // Keep the latest callback without re-rendering the widget.
  const onTokenRef = useRef(onToken);
  onTokenRef.current = onToken;

  useEffect(() => {
    if (!ready || !SITE_KEY || !ref.current) return;
    if (widgetId.current !== null) return;
    const api = window.turnstile;
    if (!api) return;

    widgetId.current = api.render(ref.current, {
      sitekey: SITE_KEY,
      appearance: "interaction-only",
      size: "flexible",
      callback: (token) => onTokenRef.current(token),
      "expired-callback": () => onTokenRef.current(null),
      "error-callback": () => onTokenRef.current(null),
    });
  }, [ready]);

  if (!SITE_KEY) return null;

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="lazyOnload"
        onLoad={() => setReady(true)}
      />
      <div ref={ref} />
    </>
  );
}
