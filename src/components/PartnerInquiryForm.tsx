"use client";

import { useRef, useState, type FormEvent } from "react";
import Corners from "@/components/Corners";
import TurnstileWidget from "@/components/TurnstileWidget";
import { Link } from "@/i18n/navigation";
import { interestOptions } from "@/content/partner";
import {
  MAX_BRANCHE_LENGTH,
  MAX_COMPANY_LENGTH,
  MAX_MESSAGE_LENGTH,
  sanitizeEmailField,
  sanitizePhoneField,
  validatePartnerInquiry,
} from "@/lib/partner-inquiry";
import styles from "@/app/[locale]/partner/partner.module.css";

type Status = { type: "idle" } | { type: "error"; message: string };

type FormState = {
  name: string;
  company: string;
  branche: string;
  email: string;
  phone: string;
  website: string;
  interest: string;
  message: string;
  privacy: boolean;
  fax: string;
};

const initial: FormState = {
  name: "",
  company: "",
  branche: "",
  email: "",
  phone: "",
  website: "",
  interest: "",
  message: "",
  privacy: false,
  fax: "",
};

export default function PartnerInquiryForm() {
  const [form, setForm] = useState<FormState>(initial);
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const inFlight = useRef(false);
  const lastAccepted = useRef<string | null>(null);

  function patch(partial: Partial<FormState>) {
    setForm((prev) => ({ ...prev, ...partial }));
    if (status.type !== "idle") setStatus({ type: "idle" });
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (inFlight.current || submitting) return;

    const validated = validatePartnerInquiry({
      ...form,
      privacy: form.privacy,
    });

    if (!validated.ok) {
      setStatus({ type: "error", message: validated.error });
      return;
    }

    const dedupeToken = validated.inquiry.keys.slice().sort().join("|");
    if (lastAccepted.current && lastAccepted.current === dedupeToken) {
      setStatus({
        type: "error",
        message: "Mit diesen Kontaktdaten wurde bereits eine Partneranfrage übermittelt.",
      });
      return;
    }

    inFlight.current = true;
    setSubmitting(true);
    setStatus({ type: "idle" });

    try {
      const res = await fetch("/api/partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, turnstileToken }),
      });
      const data = (await res.json()) as { ok?: boolean; code?: string; error?: string };

      if (res.status === 409 || data.code === "duplicate") {
        lastAccepted.current = dedupeToken;
        setStatus({
          type: "error",
          message:
            data.error ??
            "Mit diesen Kontaktdaten wurde bereits eine Partneranfrage übermittelt.",
        });
        return;
      }

      if (!res.ok || !data.ok) {
        setStatus({
          type: "error",
          message: data.error ?? "Senden fehlgeschlagen. Bitte versuchen Sie es erneut.",
        });
        return;
      }

      lastAccepted.current = dedupeToken;
      setSubmitted(true);
    } catch {
      setStatus({
        type: "error",
        message: "Netzwerkfehler. Bitte Verbindung prüfen und erneut versuchen.",
      });
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className={`blueprint ${styles.success}`} role="status">
        <Corners />
        <h3 className={styles.successTitle}>Anfrage gesendet</h3>
        <p className={styles.successBody}>
          Vielen Dank für Ihre Anfrage. Wir melden uns persönlich bei Ihnen.
        </p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <label className={styles.honeypot} aria-hidden="true">
        Fax
        <input
          tabIndex={-1}
          autoComplete="off"
          name="fax"
          value={form.fax}
          onChange={(e) => patch({ fax: e.target.value })}
        />
      </label>

      <div className={styles.formGrid}>
        <label className={styles.field}>
          <span className={styles.label}>Name / Ansprechpartner *</span>
          <input
            className={styles.input}
            name="name"
            autoComplete="name"
            required
            maxLength={120}
            value={form.name}
            disabled={submitting}
            onChange={(e) => patch({ name: e.target.value })}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Unternehmen *</span>
          <input
            className={styles.input}
            name="company"
            autoComplete="organization"
            required
            maxLength={MAX_COMPANY_LENGTH}
            value={form.company}
            disabled={submitting}
            onChange={(e) => patch({ company: e.target.value })}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>
            Branche <span className={styles.optional}>(optional)</span>
          </span>
          <input
            className={styles.input}
            name="branche"
            maxLength={MAX_BRANCHE_LENGTH}
            value={form.branche}
            disabled={submitting}
            onChange={(e) => patch({ branche: e.target.value })}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>E-Mail *</span>
          <input
            className={styles.input}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={form.email}
            disabled={submitting}
            onChange={(e) => patch({ email: sanitizeEmailField(e.target.value) })}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>
            Telefon <span className={styles.optional}>(optional)</span>
          </span>
          <input
            className={styles.input}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={form.phone}
            disabled={submitting}
            onChange={(e) => patch({ phone: sanitizePhoneField(e.target.value) })}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>
            Website <span className={styles.optional}>(optional)</span>
          </span>
          <input
            className={styles.input}
            name="website"
            type="text"
            inputMode="url"
            autoComplete="url"
            value={form.website}
            disabled={submitting}
            onChange={(e) => patch({ website: e.target.value })}
          />
        </label>
        <label className={`${styles.field} ${styles.fieldFull}`}>
          <span className={styles.label}>Ich interessiere mich für:</span>
          <select
            className={styles.input}
            name="interest"
            value={form.interest}
            disabled={submitting}
            onChange={(e) => patch({ interest: e.target.value })}
          >
            <option value="">Bitte wählen</option>
            {interestOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className={`${styles.field} ${styles.fieldFull}`}>
          <span className={styles.label}>
            Nachricht <span className={styles.optional}>(optional)</span>
          </span>
          <textarea
            className={styles.textarea}
            name="message"
            rows={5}
            maxLength={MAX_MESSAGE_LENGTH}
            value={form.message}
            disabled={submitting}
            onChange={(e) => patch({ message: e.target.value })}
          />
        </label>
      </div>

      <TurnstileWidget onToken={setTurnstileToken} />

      <label className={styles.privacy}>
        <input
          type="checkbox"
          name="privacy"
          required
          checked={form.privacy}
          disabled={submitting}
          onChange={(e) => patch({ privacy: e.target.checked })}
        />
        <span>
          Ich habe die{" "}
          <Link href="/datenschutz" className={styles.privacyLink}>
            Datenschutzerklärung
          </Link>{" "}
          gelesen und willige in die Verarbeitung meiner Angaben zur Bearbeitung der Anfrage ein.
        </span>
      </label>

      <div className={styles.formActions}>
        <button type="submit" className="btn btn-primary btn-lg blueprint" disabled={submitting}>
          <Corners />
          {submitting ? "Wird gesendet…" : "Zusammenarbeit anfragen"}
        </button>
      </div>

      {status.type === "error" ? (
        <p role="status" className={styles.statusError}>
          {status.message}
        </p>
      ) : null}
    </form>
  );
}
