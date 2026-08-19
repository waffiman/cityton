"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import Corners from "@/components/Corners";
import { kontakt, type GoalValue, type ObjektartValue } from "@/content/kontakt";
import {
  MAX_MESSAGE_LENGTH,
  sanitizeEmailField,
  sanitizePhoneField,
  validateInquiry,
} from "@/lib/kontakt-inquiry";
import styles from "@/app/kontakt/kontakt.module.css";

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
  const [form, setForm] = useState<FormState>(initial);
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const [submitting, setSubmitting] = useState(false);
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
        message: "Mit diesen Kontaktdaten wurde bereits eine Anfrage übermittelt.",
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
            data.error ?? "Mit diesen Kontaktdaten wurde bereits eine Anfrage übermittelt.",
        });
        return;
      }

      if (!res.ok || !data.ok) {
        setStatus({
          type: "error",
          message: data.error ?? "Senden fehlgeschlagen. Bitte erneut versuchen.",
        });
        return;
      }

      lastAccepted.current = dedupeToken;
      setStatus({ type: "success", message: kontakt.success });
      setForm(initial);
    } catch {
      setStatus({
        type: "error",
        message: "Netzwerkfehler. Bitte Verbindung prüfen und erneut senden.",
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
        Website
        <input
          tabIndex={-1}
          autoComplete="off"
          name="website"
          value={form.website}
          onChange={(e) => patch({ website: e.target.value })}
        />
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Name</span>
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
        <span className={styles.label}>Objektart</span>
        <select
          className={styles.input}
          name="objektart"
          required
          value={form.objektart}
          disabled={submitting}
          onChange={(e) => patch({ objektart: e.target.value as ObjektartValue | "" })}
        >
          <option value="" disabled>
            Bitte wählen
          </option>
          {kontakt.objectTypes.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.field}>
        <span className={styles.label}>
          Fläche <span className={styles.optional}>(optional)</span>
        </span>
        <input
          className={styles.input}
          name="flaeche"
          placeholder="z. B. ca. 40 m² Glas / 8 Fenster"
          maxLength={80}
          value={form.flaeche}
          disabled={submitting}
          onChange={(e) => patch({ flaeche: e.target.value })}
        />
      </label>

      <fieldset className={styles.fieldset}>
        <legend className={styles.label}>Ziel</legend>
        <div className={styles.chips}>
          {kontakt.goals.map((g) => {
            const on = form.goals.includes(g.value);
            return (
              <button
                key={g.value}
                type="button"
                className={`${styles.chip}${on ? ` ${styles.chipOn}` : ""}`}
                aria-pressed={on}
                disabled={submitting}
                onClick={() => toggleGoal(g.value)}
              >
                {g.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className={styles.contactRow}>
        <label className={styles.field}>
          <span className={styles.label}>Telefon</span>
          <input
            className={styles.input}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+43 …"
            value={form.phone}
            disabled={submitting}
            onChange={(e) => patch({ phone: sanitizePhoneField(e.target.value) })}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>E-Mail</span>
          <input
            className={styles.input}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="name@firma.at"
            value={form.email}
            disabled={submitting}
            onChange={(e) => patch({ email: sanitizeEmailField(e.target.value) })}
          />
        </label>
      </div>
      <p className={styles.hint}>Mindestens Telefon oder E-Mail angeben.</p>

      <label className={styles.field}>
        <span className={styles.label}>
          {kontakt.messageLabel} <span className={styles.optional}>(optional)</span>
        </span>
        <textarea
          className={styles.textarea}
          name="message"
          rows={5}
          placeholder={kontakt.messagePlaceholder}
          maxLength={MAX_MESSAGE_LENGTH}
          value={form.message}
          disabled={submitting}
          onChange={(e) => patch({ message: e.target.value })}
        />
      </label>

      <label className={styles.privacy}>
        <input
          type="checkbox"
          name="privacy"
          checked={form.privacy}
          disabled={submitting}
          onChange={(e) => patch({ privacy: e.target.checked })}
        />
        <span>
          {kontakt.privacyPrefix}{" "}
          <Link href="/datenschutz" className={styles.privacyLink}>
            {kontakt.privacyLink}
          </Link>{" "}
          {kontakt.privacySuffix}
        </span>
      </label>

      <div className={styles.actions}>
        <button type="submit" className="btn btn-primary btn-lg blueprint" disabled={submitting}>
          <Corners />
          {submitting ? kontakt.submitting : kontakt.submit}
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
