/**
 * Persist chatbot leads into the shared Inquiry CRM table (source="chatbot").
 */

import { prisma } from "@/lib/db";
import { normalizeEmail, normalizePhone, parseContact } from "@/lib/contact-lead";
import { sendLeadNotification } from "@/lib/mailer";

const DEDUPE_WINDOW_MS = 24 * 60 * 60 * 1000;

export type ChatLeadInput = {
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  message?: string | null;
  /** Short transcript snippet stored in Inquiry.message. */
  transcript?: string | null;
};

export type SaveChatLeadResult =
  | { status: "created"; id: string }
  | { status: "duplicate"; id: string }
  | { status: "error"; error: string };

export async function saveChatLead(input: ChatLeadInput): Promise<SaveChatLeadResult> {
  const emailRaw = input.email?.trim() || null;
  const phoneRaw = input.phone?.trim() || null;

  if (!emailRaw && !phoneRaw) {
    return { status: "error", error: "Phone or email is required." };
  }

  const dedupeKeys: string[] = [];
  let email: string | null = null;
  let phone: string | null = null;

  if (emailRaw) {
    const parsed = parseContact(emailRaw);
    if (!parsed.ok || parsed.kind !== "email") {
      return { status: "error", error: "Invalid email." };
    }
    email = parsed.display;
    dedupeKeys.push(parsed.key);
  }
  if (phoneRaw) {
    const parsed = parseContact(phoneRaw);
    if (!parsed.ok || parsed.kind !== "phone") {
      return { status: "error", error: "Invalid phone." };
    }
    phone = parsed.display;
    dedupeKeys.push(parsed.key);
  }

  const since = new Date(Date.now() - DEDUPE_WINDOW_MS);
  const existing = await prisma.inquiry.findFirst({
    where: {
      source: "chatbot",
      dedupeKeys: { hasSome: dedupeKeys },
      createdAt: { gte: since },
    },
    orderBy: { createdAt: "desc" },
  });
  if (existing) return { status: "duplicate", id: existing.id };

  const messageParts = [
    input.message?.trim(),
    input.transcript?.trim() ? `---\nChat:\n${input.transcript.trim()}` : null,
  ].filter(Boolean);

  const created = await prisma.inquiry.create({
    data: {
      source: "chatbot",
      name: input.name?.trim() || null,
      email,
      phone,
      message: messageParts.length ? messageParts.join("\n\n") : null,
      dedupeKeys,
    },
  });

  return { status: "created", id: created.id };
}

/** Best-effort notification after a lead is created. */
export async function notifyChatLead(input: ChatLeadInput): Promise<void> {
  try {
    if (input.email) {
      await sendLeadNotification("email", normalizeEmail(input.email));
    } else if (input.phone) {
      await sendLeadNotification("phone", normalizePhone(input.phone));
    }
  } catch (err) {
    console.error("[chat] lead mail failed:", err);
  }
}
