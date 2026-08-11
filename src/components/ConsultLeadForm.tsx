"use client";

import { useRef, useState, type FormEvent } from "react";
import Corners from "@/components/Corners";
import { parseContact } from "@/lib/contact-lead";
import { site } from "@/content/site";
import styles from "@/app/home.module.css";

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
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const [submitting, setSubmitting] = useState(false);
  const inFlight = useRef(false);
  /** Last value accepted by the server — resubmitting it is blocked client-side too. */
  const lastAccepted = useRef<string | null>(null);

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
        message: "Diese Kontaktangabe wurde bereits übermittelt.",
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
        body: JSON.stringify({ contact: value }),
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
          message: data.error ?? "Diese Kontaktangabe wurde bereits übermittelt.",
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

      lastAccepted.current = parsed.key;
      setStatus({
        type: "success",
        message: "Danke — wir melden uns in Kürze bei Ihnen.",
      });
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

  return (
    <form className={styles.consultForm} onSubmit={onSubmit} noValidate>
      <label className={styles.consultField}>
        <span className={styles.consultFieldLabel}>Telefon oder E-Mail</span>
        <input
          className={styles.consultInput}
          type="text"
          name="contact"
          autoComplete="tel email"
          inputMode="text"
          placeholder="Telefonnummer oder E-Mail"
          value={value}
          disabled={submitting}
          aria-invalid={status.type === "error" || status.type === "duplicate"}
          aria-describedby={status.type !== "idle" ? "consult-lead-status" : undefined}
          onChange={(e) => {
            setValue(e.target.value);
            if (status.type !== "idle") setStatus({ type: "idle" });
          }}
        />
      </label>

      <div className={styles.consultFormActions}>
        <button type="submit" className="btn btn-primary btn-lg blueprint" disabled={submitting}>
          <Corners />
          {submitting ? "Wird gesendet…" : site.cta}
        </button>
        <span className={styles.consultPhone}>
          oder anrufen: <span className={styles.placeholder}>{site.contact.phone}</span>
        </span>
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
