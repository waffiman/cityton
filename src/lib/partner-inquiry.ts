/**
 * B2B partner inquiry: validate/normalize payload shared by client form and API.
 */

import { interestValues, type InterestValue } from "@/content/partner";
import {
  looksLikeEmail,
  parseContact,
  sanitizeContactInput,
} from "@/lib/contact-lead";

const INTEREST = new Set<string>(interestValues);

export const MAX_MESSAGE_LENGTH = 2000;
export const MAX_NAME_LENGTH = 120;
export const MAX_COMPANY_LENGTH = 160;
export const MAX_BRANCH_LENGTH = 120;
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
  /** Honeypot — must be empty. */
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

function sanitizeWebsite(raw: string): string {
  if (!raw) return "";
  const trimmed = raw.slice(0, MAX_WEBSITE_LENGTH).trim();
  if (!trimmed) return "";
  // Allow bare domains; reject obvious junk.
  if (/\s/.test(trimmed)) return "";
  return trimmed;
}

export function sanitizePhoneField(raw: string): string {
  return sanitizeContactInput(raw);
}

export function sanitizeEmailField(raw: string): string {
  return sanitizeContactInput(raw);
}

export function validatePartnerInquiry(input: PartnerInquiryInput): ValidatePartnerResult {
  if (asString(input.fax)) {
    return { ok: false, error: "Spam erkannt.", spam: true };
  }

  const name = asString(input.name).slice(0, MAX_NAME_LENGTH);
  if (!name) return { ok: false, error: "Bitte Ihren Namen eingeben." };

  const company = asString(input.company).slice(0, MAX_COMPANY_LENGTH);
  if (!company) return { ok: false, error: "Bitte Ihren Firmennamen eingeben." };

  const branche = asString(input.branche).slice(0, MAX_BRANCH_LENGTH);

  if (input.privacy !== true && input.privacy !== "true" && input.privacy !== "on") {
    return { ok: false, error: "Bitte die Datenschutzerklärung akzeptieren." };
  }

  const emailParsed = parseRequiredEmail(asString(input.email));
  if (!emailParsed.ok) return emailParsed;

  const phoneParsed = parseOptionalPhone(asString(input.phone));
  if (phoneParsed && !phoneParsed.ok) return phoneParsed;

  const interestRaw = asString(input.interest);
  const interest =
    interestRaw && INTEREST.has(interestRaw) ? (interestRaw as InterestValue) : null;

  const website = sanitizeWebsite(asString(input.website));
  const message = asString(input.message).slice(0, MAX_MESSAGE_LENGTH);

  const keys = [emailParsed.key];
  if (phoneParsed) keys.push(phoneParsed.key);

  return {
    ok: true,
    inquiry: {
      name,
      company,
      branche,
      email: emailParsed.display,
      phone: phoneParsed ? phoneParsed.display : null,
      website,
      interest,
      message,
      keys,
    },
  };
}
