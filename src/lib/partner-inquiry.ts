/**
 * B2B partner inquiry: validate/normalize payload shared by client form and API.
 * German messages — the /partner route is DE-only.
 */

import { interestOptions, type InterestValue } from "@/content/partner";
import {
  looksLikeEmail,
  MAX_EMAIL_LENGTH,
  parseContact,
  sanitizeContactInput,
} from "@/lib/contact-lead";

const INTEREST_VALUES = new Set<string>(interestOptions.map((o) => o.value));

export const MAX_MESSAGE_LENGTH = 2000;
export const MAX_COMPANY_LENGTH = 160;
export const MAX_BRANCHE_LENGTH = 120;
export const MAX_WEBSITE_LENGTH = 200;

export type PartnerInquiryInput = {
  name?: unknown;
  company?: unknown;
  branche?: unknown;
  email?: unknown;
  phone?: unknown;
  website?: unknown;
  interest?: unknown;
  message?: unknown;
  privacy?: unknown;
  /** Honeypot — must be empty. Not the visitor's website field. */
  fax?: unknown;
};

export type NormalizedPartnerInquiry = {
  name: string;
  company: string;
  branche: string;
  email: string;
  phone: string | null;
  website: string;
  interest: InterestValue | null;
  message: string;
  keys: string[];
};

export type ValidatePartnerResult =
  | { ok: true; inquiry: NormalizedPartnerInquiry }
  | { ok: false; error: string; spam?: boolean };

function asString(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

function parseRequiredEmail(
  raw: string,
): { ok: true; display: string; key: string } | { ok: false; error: string } {
  if (!raw) return { ok: false, error: "Bitte eine E-Mail-Adresse eingeben." };
  const parsed = parseContact(raw);
  if (!parsed.ok || parsed.kind !== "email") {
    return { ok: false, error: "Bitte eine gültige E-Mail-Adresse eingeben." };
  }
  return { ok: true, display: parsed.display, key: parsed.key };
}

function parseOptionalPhone(
  raw: string,
): { ok: true; display: string; key: string } | { ok: false; error: string } | null {
  if (!raw) return null;
  if (looksLikeEmail(raw)) {
    return { ok: false, error: "Bitte eine gültige Telefonnummer eingeben." };
  }
  const parsed = parseContact(raw);
  if (!parsed.ok || parsed.kind !== "phone") {
    return { ok: false, error: "Bitte eine gültige Telefonnummer eingeben." };
  }
  return { ok: true, display: parsed.display, key: parsed.key };
}

function parseOptionalWebsite(
  raw: string,
): { ok: true; display: string } | { ok: false; error: string } | null {
  if (!raw) return null;
  if (raw.length > MAX_WEBSITE_LENGTH) {
    return { ok: false, error: "Die Website-Adresse ist zu lang." };
  }
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const url = new URL(withProtocol);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return { ok: false, error: "Bitte eine gültige Website-Adresse eingeben." };
    }
    if (!url.hostname.includes(".")) {
      return { ok: false, error: "Bitte eine gültige Website-Adresse eingeben." };
    }
    return { ok: true, display: url.toString() };
  } catch {
    return { ok: false, error: "Bitte eine gültige Website-Adresse eingeben." };
  }
}

export function validatePartnerInquiry(body: PartnerInquiryInput): ValidatePartnerResult {
  if (asString(body.fax)) {
    return { ok: false, error: "Anfrage abgelehnt.", spam: true };
  }

  const name = asString(body.name);
  if (name.length < 2) {
    return { ok: false, error: "Bitte Ihren Namen eingeben." };
  }
  if (name.length > 120) {
    return { ok: false, error: "Der Name ist zu lang." };
  }

  const company = asString(body.company);
  if (company.length < 2) {
    return { ok: false, error: "Bitte den Firmennamen eingeben." };
  }
  if (company.length > MAX_COMPANY_LENGTH) {
    return { ok: false, error: "Der Firmenname ist zu lang." };
  }

  const branche = asString(body.branche);
  if (branche.length > MAX_BRANCHE_LENGTH) {
    return { ok: false, error: "Die Branchenangabe ist zu lang." };
  }

  const message = asString(body.message);
  if (message.length > MAX_MESSAGE_LENGTH) {
    return { ok: false, error: "Die Nachricht ist zu lang." };
  }

  const interestRaw = asString(body.interest);
  if (interestRaw && !INTEREST_VALUES.has(interestRaw)) {
    return { ok: false, error: "Bitte ein gültiges Kooperationsmodell wählen." };
  }

  const email = parseRequiredEmail(asString(body.email));
  if (!email.ok) return { ok: false, error: email.error };

  const phone = parseOptionalPhone(asString(body.phone));
  if (phone && !phone.ok) return { ok: false, error: phone.error };

  const website = parseOptionalWebsite(asString(body.website));
  if (website && !website.ok) return { ok: false, error: website.error };

  if (body.privacy !== true && body.privacy !== "true" && body.privacy !== "on") {
    return { ok: false, error: "Bitte der Datenschutzerklärung zustimmen." };
  }

  const keys: string[] = [email.key];
  if (phone?.ok) keys.push(phone.key);

  return {
    ok: true,
    inquiry: {
      name,
      company,
      branche,
      email: email.display,
      phone: phone?.ok ? phone.display : null,
      website: website?.ok ? website.display : "",
      interest: interestRaw ? (interestRaw as InterestValue) : null,
      message,
      keys,
    },
  };
}

export function composePartnerMessage(branche: string, message: string): string {
  if (branche && message) return `Branche: ${branche}\n\n${message}`;
  if (branche) return `Branche: ${branche}`;
  return message;
}

export function sanitizePhoneField(raw: string): string {
  return sanitizeContactInput(raw.replace(/[a-zA-Z@]/g, ""));
}

export function sanitizeEmailField(raw: string): string {
  let out = "";
  for (const ch of raw) {
    if (ch === " ") continue;
    if (!/[a-zA-Z0-9@._+\-]/.test(ch)) continue;
    out += ch;
    if (out.length >= MAX_EMAIL_LENGTH) break;
  }
  return out;
}
