"use client";

import { useTranslations } from "next-intl";
import { useRef, useState, type FormEvent } from "react";
import { Link } from "@/i18n/navigation";
import Corners from "@/components/Corners";
import TurnstileWidget from "@/components/TurnstileWidget";
import { interestValues, type InterestValue } from "@/content/partner";
import {
  MAX_MESSAGE_LENGTH,
  sanitizeEmailField,
  sanitizePhoneField,
  validatePartnerInquiry,
} from "@/lib/partner-inquiry";
import styles from "@/app/[locale]/partner/partner.module.css";

type Status =
  | { type: "idle" }
  | { type: "error"; message: string }
  | { type: "duplicate"; message: string }
  | { type: "success"; message: string };

type FormState = {
  name: string;
  company: string;
  branche: string;
  email: string;
  phone: string;
  website: string;
  interest: InterestValue | "";
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
  const t = useTranslations("partner");
  const [form, setForm] = useState<FormState>(initial);
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const [submitting, setSubmitting] = useState(false);
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
      name: form.name,
      company: form.company,
      branche: form.branche,
      email: form.email,
      phone: form.phone,
      website: form.website,
      interest: form.interest,
      message: form.message,
      privacy: form.privacy,
      fax: form.fax,
    });

    if (!validated.ok) {
      setStatus({ type: "error", message: validated.error });
      return;
    }

    const dedupeToken = validated.inquiry.keys.sort().join("|");
    if (lastAccepted.current && dedupeToken === lastAccepted.current) {
      setStatus({ type: "duplicate", message: t("form.duplicateError") });
      return;
    }

    inFlight.current = true;
    setSubmitting(true);
    setStatus({ type: "idle" });

    try {
      const res = await fetch("/api/partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          company: form.company,
          branche: form.branche,
          email: form.email,
          phone: form.phone,
          website: form.website,
          interest: form.interest,
          message: form.message,
          privacy: form.privacy,
          fax: form.fax,
          turnstileToken,
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        code?: string;
        error?: string;
      };

      if (res.status === 409 || data.code === "duplicate") {
        lastAccepted.current = dedupeToken;
        setStatus({
          type: "duplicate",
          message: data.error ?? t("form.duplicateError"),
        });
        return;
      }

      if (!res.ok || !data.ok) {
        setStatus({
          type: "error",
          message: data.error ?? t("form.sendFailedError"),
        });
        return;
      }

      lastAccepted.current = dedupeToken;
      setStatus({ type: "success", message: t("form.successBody") });
      setForm(initial);
    } catch {
      setStatus({ type: "error", message: t("form.networkError") });
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  }

  if (status.type === "success") {
    return (
      <div className={`blueprint ${styles.success}`} role="status">
        <Corners />
        <h3 className={styles.successTitle}>{t("form.successTitle")}</h3>
        <p className={styles.successBody}>{status.message}</p>
      </div>
    );
  }

  const invalid = status.type === "error" || status.type === "duplicate";

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <label className={styles.honeypot} aria-hidden="true">
        {t("form.honeypotLabel")}
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
          <span className={styles.label}>{t("form.nameLabel")}</span>
          <input
            className={styles.input}
            name="name"
            autoComplete="name"
            required
            maxLength={120}
            value={form.name}
            disabled={submitting}
            aria-invalid={invalid}
            onChange={(e) => patch({ name: e.target.value })}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>{t("form.companyLabel")}</span>
          <input
            className={styles.input}
            name="company"
            autoComplete="organization"
            required
            maxLength={160}
            value={form.company}
            disabled={submitting}
            onChange={(e) => patch({ company: e.target.value })}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>
            {t("form.brancheLabel")} <span className={styles.optional}>{t("form.optional")}</span>
          </span>
          <input
            className={styles.input}
            name="branche"
            maxLength={120}
            value={form.branche}
            disabled={submitting}
            onChange={(e) => patch({ branche: e.target.value })}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>{t("form.emailLabel")}</span>
          <input
            className={styles.input}
            name="email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            disabled={submitting}
            onChange={(e) => patch({ email: sanitizeEmailField(e.target.value) })}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>
            {t("form.phoneLabel")} <span className={styles.optional}>{t("form.optional")}</span>
          </span>
          <input
            className={styles.input}
            name="phone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            disabled={submitting}
            onChange={(e) => patch({ phone: sanitizePhoneField(e.target.value) })}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>
            {t("form.websiteLabel")} <span className={styles.optional}>{t("form.optional")}</span>
          </span>
          <input
            className={styles.input}
            name="website"
            type="url"
            autoComplete="url"
            placeholder="https://"
            value={form.website}
            disabled={submitting}
            onChange={(e) => patch({ website: e.target.value })}
          />
        </label>

        <label className={`${styles.field} ${styles.fieldFull}`}>
          <span className={styles.label}>{t("form.interestLabel")}</span>
          <select
            className={styles.input}
            name="interest"
            value={form.interest}
            disabled={submitting}
            onChange={(e) => patch({ interest: e.target.value as InterestValue | "" })}
          >
            <option value="" disabled>
              {t("form.interestPlaceholder")}
            </option>
            {interestValues.map((value) => (
              <option key={value} value={value}>
                {t(`interests.${value}`)}
              </option>
            ))}
          </select>
        </label>

        <label className={`${styles.field} ${styles.fieldFull}`}>
          <span className={styles.label}>
            {t("form.messageLabel")} <span className={styles.optional}>{t("form.optional")}</span>
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
          checked={form.privacy}
          disabled={submitting}
          onChange={(e) => patch({ privacy: e.target.checked })}
        />
        <span>
          {t("form.privacyPrefix")}{" "}
          <Link href="/datenschutz" className={styles.privacyLink}>
            {t("form.privacyLink")}
          </Link>{" "}
          {t("form.privacySuffix")}
        </span>
      </label>

      <div className={styles.formActions}>
        <button type="submit" className="btn btn-primary btn-lg blueprint" disabled={submitting}>
          <Corners />
          {submitting ? t("form.submitting") : t("form.submit")}
        </button>
      </div>

      {status.type === "error" || status.type === "duplicate" ? (
        <p role="status" className={styles.statusError}>
          {status.message}
        </p>
      ) : null}
    </form>
  );
}
