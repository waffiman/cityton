"use client";

import { useTranslations } from "next-intl";
import { useRef, useState, type FormEvent } from "react";
import Corners from "@/components/Corners";
import TurnstileWidget from "@/components/TurnstileWidget";
import { isEmailInput, MAX_EMAIL_LENGTH, parseContact, sanitizeContactInput } from "@/lib/contact-lead";
import styles from "@/app/[locale]/home.module.css";

type Status =
  | { type: "idle" }
  | { type: "error"; message: string }
  | { type: "duplicate"; message: string }
  | { type: "success"; message: string };

/**
 * Single-field lead form for the Beratungstermin band: phone or email, with
 * client hints plus authoritative server validation and dedupe.
 */
export default function ConsultLeadForm() {
  const t = useTranslations();
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const [submitting, setSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const inFlight = useRef(false);
  /** Last value accepted by the server — resubmitting it is blocked client-side too. */
  const lastAccepted = useRef<string | null>(null);

  function applyInput(next: string) {
    setValue(sanitizeContactInput(next));
    if (status.type !== "idle") setStatus({ type: "idle" });
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (inFlight.current || submitting) return;

    const parsed = parseContact(value);
    if (!parsed.ok) {
      setStatus({ type: "error", message: parsed.error });
      return;
    }

    if (lastAccepted.current && parsed.key === lastAccepted.current) {
      setStatus({
        type: "duplicate",
        message: t("kontakt.quickForm.duplicateError"),
      });
      return;
    }

    inFlight.current = true;
    setSubmitting(true);
    setStatus({ type: "idle" });

    try {
      const res = await fetch("/api/beratung", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact: value, turnstileToken }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        code?: string;
        error?: string;
      };

      if (res.status === 409 || data.code === "duplicate") {
        lastAccepted.current = parsed.key;
        setStatus({
          type: "duplicate",
          message: data.error ?? t("kontakt.quickForm.duplicateError"),
        });
        return;
      }

      if (!res.ok || !data.ok) {
        setStatus({
          type: "error",
          message: data.error ?? t("kontakt.quickForm.sendFailedError"),
        });
        return;
      }

      lastAccepted.current = parsed.key;
      setStatus({
        type: "success",
        message: t("kontakt.quickForm.success"),
      });
    } catch {
      setStatus({
        type: "error",
        message: t("kontakt.quickForm.networkError"),
      });
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  }

  return (
    <form className={styles.consultForm} onSubmit={onSubmit} noValidate>
      <label className={styles.consultField}>
        <input
          className={styles.consultInput}
          type="text"
          name="contact"
          aria-label={t("kontakt.quickForm.ariaLabel")}
          autoComplete="tel email"
          inputMode={isEmailInput(value) ? "email" : "tel"}
          placeholder={t("kontakt.quickForm.placeholder")}
          value={value}
          disabled={submitting}
          maxLength={isEmailInput(value) ? MAX_EMAIL_LENGTH : undefined}
          aria-invalid={status.type === "error" || status.type === "duplicate"}
          aria-describedby={status.type !== "idle" ? "consult-lead-status" : undefined}
          onChange={(e) => applyInput(e.target.value)}
          onPaste={(e) => {
            e.preventDefault();
            const pasted = e.clipboardData.getData("text");
            const el = e.currentTarget;
            const start = el.selectionStart ?? value.length;
            const end = el.selectionEnd ?? value.length;
            applyInput(value.slice(0, start) + pasted + value.slice(end));
          }}
        />
      </label>

      <TurnstileWidget onToken={setTurnstileToken} />

      <div className={styles.consultFormActions}>
        <button type="submit" className="btn btn-primary btn-lg blueprint" disabled={submitting}>
          <Corners />
          {submitting ? t("kontakt.quickForm.sending") : t("site.cta")}
        </button>
      </div>

      {status.type !== "idle" ? (
        <p
          id="consult-lead-status"
          role="status"
          className={
            status.type === "success" ? styles.consultFormOk : styles.consultFormError
          }
        >
          {status.message}
        </p>
      ) : null}
    </form>
  );
}
