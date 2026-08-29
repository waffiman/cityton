"use client";

import { useTranslations } from "next-intl";
import { useRef, useState, type FormEvent } from "react";
import { Link } from "@/i18n/navigation";
import Corners from "@/components/Corners";
import TurnstileWidget from "@/components/TurnstileWidget";
import { objectTypeValues, goalValues, type GoalValue, type ObjektartValue } from "@/content/kontakt";
import {
  MAX_MESSAGE_LENGTH,
  sanitizeEmailField,
  sanitizePhoneField,
  validateInquiry,
} from "@/lib/kontakt-inquiry";
import styles from "@/app/[locale]/kontakt/kontakt.module.css";

type Status =
  | { type: "idle" }
  | { type: "error"; message: string }
  | { type: "duplicate"; message: string }
  | { type: "success"; message: string };

type FormState = {
  name: string;
  objektart: ObjektartValue | "";
  flaeche: string;
  goals: GoalValue[];
  message: string;
  phone: string;
  email: string;
  privacy: boolean;
  website: string;
};

const initial: FormState = {
  name: "",
  objektart: "",
  flaeche: "",
  goals: [],
  message: "",
  phone: "",
  email: "",
  privacy: false,
  website: "",
};

export default function KontaktInquiryForm() {
  const t = useTranslations("kontakt");
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

  function toggleGoal(value: GoalValue) {
    setForm((prev) => {
      const next = prev.goals.includes(value)
        ? prev.goals.filter((g) => g !== value)
        : [...prev.goals, value];
      return { ...prev, goals: next };
    });
    if (status.type !== "idle") setStatus({ type: "idle" });
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (inFlight.current || submitting) return;

    const validated = validateInquiry({
      name: form.name,
      objektart: form.objektart,
      flaeche: form.flaeche,
      goals: form.goals,
      message: form.message,
      phone: form.phone,
      email: form.email,
      privacy: form.privacy,
      website: form.website,
    });

    if (!validated.ok) {
      setStatus({ type: "error", message: validated.error });
      return;
    }

    const dedupeToken = validated.inquiry.keys.slice().sort().join("|");
    if (lastAccepted.current && lastAccepted.current === dedupeToken) {
      setStatus({
        type: "duplicate",
        message: t("duplicateError"),
      });
      return;
    }

    inFlight.current = true;
    setSubmitting(true);
    setStatus({ type: "idle" });

    try {
      const res = await fetch("/api/kontakt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          objektart: form.objektart,
          flaeche: form.flaeche,
          goals: form.goals,
          message: form.message,
          phone: form.phone,
          email: form.email,
          privacy: form.privacy,
          website: form.website,
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
          message:
            data.error ?? t("duplicateError"),
        });
        return;
      }

      if (!res.ok || !data.ok) {
        setStatus({
          type: "error",
          message: data.error ?? t("sendFailedError"),
        });
        return;
      }

      lastAccepted.current = dedupeToken;
      setStatus({ type: "success", message: t("success") });
      setForm(initial);
    } catch {
      setStatus({
        type: "error",
        message: t("networkError"),
      });
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  }

  const invalid = status.type === "error" || status.type === "duplicate";

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <label className={styles.honeypot} aria-hidden="true">
        {t("honeypotLabel")}
        <input
          tabIndex={-1}
          autoComplete="off"
          name="website"
          value={form.website}
          onChange={(e) => patch({ website: e.target.value })}
        />
      </label>

      <label className={styles.field}>
        <span className={styles.label}>{t("nameLabel")}</span>
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
        <span className={styles.label}>{t("objektartLabel")}</span>
        <select
          className={styles.input}
          name="objektart"
          required
          value={form.objektart}
          disabled={submitting}
          onChange={(e) => patch({ objektart: e.target.value as ObjektartValue | "" })}
        >
          <option value="" disabled>
            {t("objektartPlaceholder")}
          </option>
          {objectTypeValues.map((value) => (
            <option key={value} value={value}>
              {t(`objectTypes.${value}`)}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.field}>
        <span className={styles.label}>
          {t("flaecheLabel")} <span className={styles.optional}>{t("optional")}</span>
        </span>
        <input
          className={styles.input}
          name="flaeche"
          placeholder={t("flaechePlaceholder")}
          maxLength={80}
          value={form.flaeche}
          disabled={submitting}
          onChange={(e) => patch({ flaeche: e.target.value })}
        />
      </label>

      <fieldset className={styles.fieldset}>
        <legend className={styles.label}>{t("goalLabel")}</legend>
        <div className={styles.chips}>
          {goalValues.map((value) => {
            const on = form.goals.includes(value);
            return (
              <button
                key={value}
                type="button"
                className={`${styles.chip}${on ? ` ${styles.chipOn}` : ""}`}
                aria-pressed={on}
                disabled={submitting}
                onClick={() => toggleGoal(value)}
              >
                {t(`goals.${value}`)}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className={styles.contactRow}>
        <label className={styles.field}>
          <span className={styles.label}>{t("phoneLabel")}</span>
          <input
            className={styles.input}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder={t("phonePlaceholder")}
            value={form.phone}
            disabled={submitting}
            onChange={(e) => patch({ phone: sanitizePhoneField(e.target.value) })}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>{t("emailLabel")}</span>
          <input
            className={styles.input}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder={t("emailPlaceholder")}
            value={form.email}
            disabled={submitting}
            onChange={(e) => patch({ email: sanitizeEmailField(e.target.value) })}
          />
        </label>
      </div>
      <p className={styles.hint}>{t("contactHint")}</p>

      <label className={styles.field}>
        <span className={styles.label}>
          {t("messageLabel")} <span className={styles.optional}>{t("optional")}</span>
        </span>
        <textarea
          className={styles.textarea}
          name="message"
          rows={5}
          placeholder={t("messagePlaceholder")}
          maxLength={MAX_MESSAGE_LENGTH}
          value={form.message}
          disabled={submitting}
          onChange={(e) => patch({ message: e.target.value })}
        />
      </label>

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
          {t("privacyPrefix")}{" "}
          <Link href="/datenschutz" className={styles.privacyLink}>
            {t("privacyLink")}
          </Link>{" "}
          {t("privacySuffix")}
        </span>
      </label>

      <div className={styles.actions}>
        <button type="submit" className="btn btn-primary btn-lg blueprint" disabled={submitting}>
          <Corners />
          {submitting ? t("submitting") : t("submit")}
        </button>
      </div>

      {status.type !== "idle" ? (
        <p
          role="status"
          className={status.type === "success" ? styles.statusOk : styles.statusError}
        >
          {status.message}
        </p>
      ) : null}
    </form>
  );
}
