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
import { site } from "@/content/site";
import deMessages from "@/messages/de.json";
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

// These notifications go to the business, not the visitor — always German
// regardless of which locale the inquiry was submitted from.
const OBJECT_LABEL = new Map(Object.entries(deMessages.kontakt.objectTypes));
const GOAL_LABEL = new Map(Object.entries(deMessages.kontakt.goals));

function line(label: string, value: string | null | undefined): string | null {
  return value ? `${label}: ${value}` : null;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Branded HTML shell for the customer-facing auto-reply. Table layout, inline
 * styles, web-safe font stack — kept deliberately plain so Outlook/Gmail render
 * it consistently. Mirrors the site's teal/dark-teal palette (globals.css). */
export function autoReplyHtml(name: string): string {
  const safeName = escapeHtml(name);
  const logoUrl = `${site.url}/media/logo-city-ton.png`;
  const teal = "#358a9a";
  const dark = "#0e3a40";
  const ink = "#1d1f20";
  const bg = "#f4f6f7";

  return `<!doctype html>
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Ihre Anfrage bei City-Ton Austria</title>
  </head>
  <body style="margin:0; padding:0; background:${bg}; font-family: Arial, Helvetica, sans-serif;">
    <div style="display:none; max-height:0; overflow:hidden; opacity:0;">
      Vielen Dank für Ihre Anfrage — wir melden uns mit einem Terminvorschlag.
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${bg};">
      <tr>
        <td align="center" style="padding: 32px 16px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px; max-width:100%; background:#ffffff; border-radius:6px; overflow:hidden;">
            <tr>
              <td align="center" style="background:#ffffff; padding: 28px 24px 20px;">
                <img src="${logoUrl}" width="150" alt="City-Ton Austria" style="display:block; width:150px; max-width:150px; height:auto; border:0;" />
              </td>
            </tr>
            <tr>
              <td style="height:4px; background:${teal}; line-height:4px; font-size:0;">&nbsp;</td>
            </tr>
            <tr>
              <td style="padding: 32px 32px 8px;">
                <p style="margin:0 0 16px; font-size:16px; line-height:1.6; color:${ink};">Guten Tag ${safeName},</p>
                <p style="margin:0 0 16px; font-size:16px; line-height:1.6; color:${ink};">
                  vielen Dank für Ihre Anfrage. Wir haben sie erhalten und melden uns mit einem
                  Terminvorschlag und den nächsten Schritten bei Ihnen.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding: 0 32px 24px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eaf4f6; border-left:3px solid ${teal}; border-radius:4px;">
                  <tr>
                    <td style="padding:14px 18px; font-size:15px; line-height:1.5; color:${dark}; font-weight:bold;">
                      Die Erstberatung ist kostenlos und unverbindlich.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 0 32px 32px;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="border-radius:4px; background:${teal};">
                      <a href="tel:${site.contact.phoneTel}" style="display:inline-block; padding:12px 28px; font-size:15px; font-weight:bold; color:#ffffff; text-decoration:none;">
                        Jetzt anrufen
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 0 32px 32px; border-top:1px solid #e2e9ea;">
                <p style="margin:20px 0 0; font-size:14px; line-height:1.7; color:${ink};">
                  Telefon: <a href="tel:${site.contact.phoneTel}" style="color:${teal}; text-decoration:none;">${site.contact.phone}</a><br />
                  E-Mail: <a href="mailto:${site.contact.email}" style="color:${teal}; text-decoration:none;">${site.contact.email}</a>
                </p>
                <p style="margin:20px 0 0; font-size:15px; line-height:1.6; color:${ink};">
                  Mit freundlichen Grüßen<br />
                  <strong>City-Ton Austria</strong>
                </p>
              </td>
            </tr>
            <tr>
              <td align="center" style="background:${dark}; padding: 20px 24px;">
                <p style="margin:0; font-size:12px; line-height:1.6; color:#cbe6ea;">
                  City-Ton Austria &middot; ${site.contact.address}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
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
    html: autoReplyHtml(inquiry.name),
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
