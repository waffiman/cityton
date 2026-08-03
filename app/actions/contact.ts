"use server";

import { z } from "zod";
import { Resend } from "resend";
import { CONTACT } from "@/content/products";

const rateMap = new Map<string, { count: number; resetAt: number }>();

function rateLimit(key: string, limit = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = rateMap.get(key);
  if (!entry || now > entry.resetAt) {
    rateMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count += 1;
  return true;
}

const clientSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().max(40).optional(),
  propertyType: z.enum(["home", "office", "retail", "security", "other"]),
  message: z.string().min(5).max(4000),
  website: z.string().max(0).optional(), // honeypot
});

const partnerSchema = z.object({
  company: z.string().min(2).max(160),
  contactPerson: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().max(40).optional(),
  role: z.enum([
    "construction",
    "glass",
    "facility",
    "architect",
    "property",
    "developer",
  ]),
  message: z.string().min(5).max(4000),
  website: z.string().max(0).optional(),
});

export type FormState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

async function sendMail(subject: string, html: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.info("[contact] RESEND_API_KEY missing — logging submission:", subject);
    console.info(html);
    return true;
  }
  const resend = new Resend(key);
  const from = process.env.CONTACT_FROM_EMAIL ?? "City-Ton <onboarding@resend.dev>";
  await resend.emails.send({
    from,
    to: CONTACT.email,
    subject,
    html,
  });
  return true;
}

export async function submitClientInquiry(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const ip = String(formData.get("_ip") || "anon");
  if (!rateLimit(`client:${ip}`)) {
    return { ok: false, error: "rate" };
  }

  const raw = {
    name: String(formData.get("name") || ""),
    email: String(formData.get("email") || ""),
    phone: String(formData.get("phone") || "") || undefined,
    propertyType: String(formData.get("propertyType") || ""),
    message: String(formData.get("message") || ""),
    website: String(formData.get("website") || ""),
  };

  if (raw.website) return { ok: true }; // bot

  const parsed = clientSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: "validation",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const d = parsed.data;
  await sendMail(
    `[B2C] Beratung — ${d.name}`,
    `<h2>Kundenanfrage</h2>
     <p><strong>Name:</strong> ${d.name}</p>
     <p><strong>Email:</strong> ${d.email}</p>
     <p><strong>Telefon:</strong> ${d.phone ?? "—"}</p>
     <p><strong>Objekt:</strong> ${d.propertyType}</p>
     <p><strong>Nachricht:</strong></p><p>${d.message.replace(/\n/g, "<br/>")}</p>`,
  );
  return { ok: true };
}

export async function submitPartnerApplication(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const ip = String(formData.get("_ip") || "anon");
  if (!rateLimit(`partner:${ip}`)) {
    return { ok: false, error: "rate" };
  }

  const raw = {
    company: String(formData.get("company") || ""),
    contactPerson: String(formData.get("contactPerson") || ""),
    email: String(formData.get("email") || ""),
    phone: String(formData.get("phone") || "") || undefined,
    role: String(formData.get("role") || ""),
    message: String(formData.get("message") || ""),
    website: String(formData.get("website") || ""),
  };

  if (raw.website) return { ok: true };

  const parsed = partnerSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: "validation",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const d = parsed.data;
  await sendMail(
    `[B2B] Partner — ${d.company}`,
    `<h2>Partnerschaftsanfrage</h2>
     <p><strong>Unternehmen:</strong> ${d.company}</p>
     <p><strong>Ansprechpartner:</strong> ${d.contactPerson}</p>
     <p><strong>Rolle:</strong> ${d.role}</p>
     <p><strong>Email:</strong> ${d.email}</p>
     <p><strong>Telefon:</strong> ${d.phone ?? "—"}</p>
     <p><strong>Nachricht:</strong></p><p>${d.message.replace(/\n/g, "<br/>")}</p>`,
  );
  return { ok: true };
}
