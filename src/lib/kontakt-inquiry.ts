/**
 * Full Kontakt inquiry: validate/normalize payload shared by client form and API.
 */

import { goalValues, objectTypeValues, type GoalValue, type ObjektartValue } from "@/content/kontakt";
import {
  looksLikeEmail,
  MAX_EMAIL_LENGTH,
  parseContact,
  sanitizeContactInput,
} from "@/lib/contact-lead";

// Validation messages here stay German: this runs both client- and
// server-side, and localizing it would mean threading a translation
// function through a currently-pure validator — left as a known follow-up,
// not part of this pass (server notification emails to the business stay
// German regardless of the visitor's locale anyway).
const OBJECT_VALUES = new Set<string>(objectTypeValues);
const GOAL_VALUES = new Set<string>(goalValues);

export const MAX_MESSAGE_LENGTH = 2000;

export type InquiryInput = {
  name?: unknown;
  objektart?: unknown;
  flaeche?: unknown;
  goals?: unknown;
  message?: unknown;
  phone?: unknown;
  email?: unknown;
  privacy?: unknown;
  /** Honeypot — must be empty. */
  website?: unknown;
};

export type NormalizedInquiry = {
  name: string;
  objektart: ObjektartValue;
  flaeche: string;
  goals: GoalValue[];
  message: string;
  phone: string | null;
  email: string | null;
  /** Dedup keys for phone and/or email. */
  keys: string[];
};

export type ValidateInquiryResult =
  | { ok: true; inquiry: NormalizedInquiry }
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

function parseOptionalEmail(
  raw: string,
): { ok: true; display: string; key: string } | { ok: false; error: string } | null {
  if (!raw) return null;
  const parsed = parseContact(raw);
  if (!parsed.ok || parsed.kind !== "email") {
    return { ok: false, error: "Bitte eine gültige E-Mail-Adresse eingeben." };
  }
  return { ok: true, display: parsed.display, key: parsed.key };
}

export function validateInquiry(body: InquiryInput): ValidateInquiryResult {
  if (asString(body.website)) {
    return { ok: false, error: "Anfrage abgelehnt.", spam: true };
  }

  const name = asString(body.name);
  if (name.length < 2) {
    return { ok: false, error: "Bitte Ihren Namen eingeben." };
  }
  if (name.length > 120) {
    return { ok: false, error: "Der Name ist zu lang." };
  }

  const objektart = asString(body.objektart);
  if (!OBJECT_VALUES.has(objektart as ObjektartValue)) {
    return { ok: false, error: "Bitte eine Objektart wählen." };
  }

  const flaeche = asString(body.flaeche);
  if (flaeche.length > 80) {
    return { ok: false, error: "Die Flächenangabe ist zu lang." };
  }

  const message = asString(body.message);
  if (message.length > MAX_MESSAGE_LENGTH) {
    return { ok: false, error: "Die Nachricht ist zu lang." };
  }

  let goalsRaw: unknown[] = [];
  if (Array.isArray(body.goals)) {
    goalsRaw = body.goals;
  } else if (typeof body.goals === "string" && body.goals) {
    goalsRaw = body.goals.split(",").map((s) => s.trim());
  }
  const goals: GoalValue[] = [];
  for (const g of goalsRaw) {
    if (typeof g !== "string") continue;
    if (!GOAL_VALUES.has(g as GoalValue)) {
      return { ok: false, error: "Ungültiges Ziel ausgewählt." };
    }
    if (!goals.includes(g as GoalValue)) goals.push(g as GoalValue);
  }
  if (goals.length === 0) {
    return { ok: false, error: "Bitte mindestens ein Ziel wählen." };
  }

  const phoneRaw = asString(body.phone);
  const emailRaw = asString(body.email);
  const phone = parseOptionalPhone(phoneRaw);
  if (phone && !phone.ok) return { ok: false, error: phone.error };
  const email = parseOptionalEmail(emailRaw);
  if (email && !email.ok) return { ok: false, error: email.error };

  if (!phone && !email) {
    return { ok: false, error: "Bitte Telefonnummer oder E-Mail angeben." };
  }

  if (body.privacy !== true && body.privacy !== "true" && body.privacy !== "on") {
    return { ok: false, error: "Bitte der Datenschutzerklärung zustimmen." };
  }

  const keys: string[] = [];
  if (phone?.ok) keys.push(phone.key);
  if (email?.ok) keys.push(email.key);

  return {
    ok: true,
    inquiry: {
      name,
      objektart: objektart as ObjektartValue,
      flaeche,
      goals,
      message,
      phone: phone?.ok ? phone.display : null,
      email: email?.ok ? email.display : null,
      keys,
    },
  };
}

/** Phone-only live sanitize (letters stripped so email mode never triggers). */
export function sanitizePhoneField(raw: string): string {
  return sanitizeContactInput(raw.replace(/[a-zA-Z@]/g, ""));
}

/** Email-only live sanitize (spaces stripped, address charset, max length). */
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
