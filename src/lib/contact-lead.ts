/**
 * Contact lead helpers: classify email vs phone, validate, and normalize for
 * duplicate detection. Phone keys strip formatting and fold common AT national
 * prefixes so "0664 123 4567" and "+43 664 1234567" collide correctly.
 */

export type ContactKind = "email" | "phone";

export type ParsedContact =
  | { ok: true; kind: ContactKind; display: string; key: string }
  | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

/** Digits only, 8–15 — covers local and international after normalization. */
const PHONE_DIGIT_RE = /^\d{8,15}$/;

/** E.164 upper bound — also the max digit count while typing a phone number. */
export const MAX_PHONE_DIGITS = 15;
export const MIN_PHONE_DIGITS = 8;
export const MAX_EMAIL_LENGTH = 254;

/** Characters kept visible while entering a phone number (besides digits and +). */
const PHONE_FORMAT_CHAR = /^[\-()./]$/;

export function looksLikeEmail(raw: string): boolean {
  return raw.includes("@");
}

/** True while the user is typing an e-mail (letters or @ before the full address). */
export function isEmailInput(raw: string): boolean {
  return /[a-zA-Z@]/.test(raw);
}

const EMAIL_INPUT_CHAR = /[a-zA-Z0-9@._+\-]/;

/**
 * Clamp live input: phones cannot exceed {@link MAX_PHONE_DIGITS} digits
 * (paste included); emails allow typical address characters, no spaces, max 254.
 */
export function sanitizeContactInput(raw: string): string {
  if (isEmailInput(raw)) {
    let out = "";
    for (const ch of raw) {
      if (ch === " ") continue;
      if (!EMAIL_INPUT_CHAR.test(ch)) continue;
      out += ch;
      if (out.length >= MAX_EMAIL_LENGTH) break;
    }
    return out;
  }

  let digits = 0;
  let out = "";

  for (const ch of raw) {
    if (/\d/.test(ch)) {
      if (digits >= MAX_PHONE_DIGITS) continue;
      digits += 1;
      out += ch;
      continue;
    }
    if (ch === "+" && out.length === 0) {
      out += ch;
      continue;
    }
    if (ch === " ") {
      // No leading, double, or trailing-ish gaps; only between digit groups.
      if (out.length === 0 || out.endsWith(" ") || !/\d$/.test(out)) continue;
      out += ch;
      continue;
    }
    if (PHONE_FORMAT_CHAR.test(ch)) {
      out += ch;
    }
  }

  return out;
}

/**
 * Normalize a phone for storage/deduping:
 * - strip spaces, dashes, parentheses, dots, slashes
 * - 00… → +…
 * - leading 0 (AT national) → +43…
 * - result is +E.164-ish or bare digits if no country hint
 */
export function normalizePhone(raw: string): string {
  let s = raw.trim().replace(/[\s\-()./]/g, "");
  if (s.startsWith("00")) s = `+${s.slice(2)}`;
  s = s.replace(/[^\d+]/g, "");
  if (s.startsWith("+")) {
    return `+${s.slice(1).replace(/\D/g, "")}`;
  }
  const digits = s.replace(/\D/g, "");
  if (digits.startsWith("0") && digits.length >= 9 && digits.length <= 13) {
    return `+43${digits.slice(1)}`;
  }
  return digits;
}

export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

export function parseContact(raw: string): ParsedContact {
  const display = raw.trim();
  if (!display) {
    return { ok: false, error: "Bitte Telefonnummer oder E-Mail eingeben." };
  }

  if (looksLikeEmail(display)) {
    const key = normalizeEmail(display);
    if (!EMAIL_RE.test(key) || key.length > MAX_EMAIL_LENGTH) {
      return { ok: false, error: "Bitte eine gültige E-Mail-Adresse eingeben." };
    }
    return { ok: true, kind: "email", display, key: `email:${key}` };
  }

  const normalized = normalizePhone(display);
  const digits = normalized.replace(/\D/g, "");
  if (!PHONE_DIGIT_RE.test(digits)) {
    return {
      ok: false,
      error: "Bitte eine gültige Telefonnummer oder E-Mail-Adresse eingeben.",
    };
  }
  return { ok: true, kind: "phone", display, key: `phone:${normalized}` };
}
