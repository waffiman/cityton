/**
 * Outbound mail for lead notifications.
 *
 * Transport is built from SMTP_* env vars and is optional: with nothing
 * configured every send is a no-op, so local dev and any deploy without
 * credentials behave exactly as before.
 *
 * Callers must treat sending as best-effort. A lead that reached Postgres is
 * already saved — an SMTP outage must never turn into a failed submission.
 */

import nodemailer, { type Transporter } from "nodemailer";
import { kontakt } from "@/content/kontakt";
import { site } from "@/content/site";
import type { StoredInquiry } from "@/lib/kontakt-inquiries-store";

let cached: Transporter | null | undefined;

function getTransport(): Transporter | null {
  if (cached !== undefined) return cached;

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  if (!host || !user || !pass) {
    cached = null;
    return cached;
  }

  const port = Number(process.env.SMTP_PORT ?? 587);
  cached = nodemailer.createTransport({
    host,
    port,
    // Implicit TLS on 465, STARTTLS everywhere else.
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465,
    auth: { user, pass },
  });
  return cached;
}

function from(): string {
  return process.env.MAIL_FROM ?? `City-Ton Austria <${site.contact.email}>`;
}

function to(): string {
  return process.env.MAIL_TO ?? site.contact.email;
}

const OBJECT_LABEL = new Map(kontakt.objectTypes.map((o) => [o.value as string, o.label]));
const GOAL_LABEL = new Map(kontakt.goals.map((g) => [g.value as string, g.label]));

function line(label: string, value: string | null | undefined): string | null {
  return value ? `${label}: ${value}` : null;
}

/** Notify the business that a full Kontakt inquiry arrived. */
export async function sendInquiryNotification(inquiry: StoredInquiry): Promise<void> {
  const transport = getTransport();
  if (!transport) return;

  const goals = inquiry.goals.map((g) => GOAL_LABEL.get(g) ?? g).join(", ");
  const body = [
    line("Name", inquiry.name),
    line("Objektart", OBJECT_LABEL.get(inquiry.objektart) ?? inquiry.objektart),
    line("Fläche", inquiry.flaeche),
    line("Ziele", goals),
    line("Telefon", inquiry.phone),
    line("E-Mail", inquiry.email),
    inquiry.message ? `\nNachricht:\n${inquiry.message}` : null,
    `\nIm Admin öffnen: ${site.url}/admin/inquiries/${inquiry.id}`,
  ]
    .filter(Boolean)
    .join("\n");

  await transport.sendMail({
    from: from(),
    to: to(),
    subject: `Neue Anfrage — ${inquiry.name}`,
    text: body,
    // Answering the notification writes straight back to the customer.
    replyTo: inquiry.email ?? undefined,
  });
}

/** Confirm receipt to the customer. Only possible when they left an address. */
export async function sendInquiryAutoReply(inquiry: StoredInquiry): Promise<void> {
  const transport = getTransport();
  if (!transport || !inquiry.email) return;

  const text = [
    `Guten Tag ${inquiry.name},`,
    "",
    "vielen Dank für Ihre Anfrage. Wir haben sie erhalten und melden uns mit einem",
    "Terminvorschlag und den nächsten Schritten bei Ihnen.",
    "",
    "Die Erstberatung ist kostenlos und unverbindlich.",
    "",
    `Telefon: ${site.contact.phone}`,
    `E-Mail: ${site.contact.email}`,
    "",
    "Mit freundlichen Grüßen",
    "City-Ton Austria",
  ].join("\n");

  await transport.sendMail({
    from: from(),
    to: inquiry.email,
    subject: "Ihre Anfrage bei City-Ton Austria",
    text,
    replyTo: to(),
  });
}

/** Notify the business about a quick Beratung lead (contact detail only). */
export async function sendLeadNotification(kind: string, contact: string): Promise<void> {
  const transport = getTransport();
  if (!transport) return;

  await transport.sendMail({
    from: from(),
    to: to(),
    subject: `Neue Schnellanfrage — ${contact}`,
    text: [
      `Über das Kurzformular ist eine neue Anfrage eingegangen.`,
      "",
      `${kind === "email" ? "E-Mail" : "Telefon"}: ${contact}`,
      "",
      `Im Admin öffnen: ${site.url}/admin/inquiries`,
    ].join("\n"),
    replyTo: kind === "email" ? contact : undefined,
  });
}
