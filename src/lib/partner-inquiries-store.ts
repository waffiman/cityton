import { prisma } from "@/lib/db";
import type { InterestValue } from "@/content/partner";
import { composePartnerMessage } from "@/lib/partner-inquiry";

export type StoredPartnerInquiry = {
  id: string;
  keys: string[];
  name: string;
  company: string;
  branche: string;
  email: string;
  phone: string | null;
  website: string;
  interest: InterestValue | null;
  message: string;
  submittedAt: string;
};

export type SavePartnerResult =
  | { status: "created"; inquiry: StoredPartnerInquiry }
  | { status: "duplicate"; inquiry: StoredPartnerInquiry };

const DEDUPE_WINDOW_MS = 24 * 60 * 60 * 1000;

function fromRow(row: {
  id: string;
  dedupeKeys: string[];
  name: string | null;
  objektart: string | null;
  flaeche: string | null;
  goals: string[];
  message: string | null;
  phone: string | null;
  email: string | null;
  createdAt: Date;
}): StoredPartnerInquiry {
  const rawMessage = row.message ?? "";
  let branche = "";
  let message = rawMessage;
  if (rawMessage.startsWith("Branche: ")) {
    const split = rawMessage.indexOf("\n\n");
    if (split === -1) {
      branche = rawMessage.slice("Branche: ".length);
      message = "";
    } else {
      branche = rawMessage.slice("Branche: ".length, split);
      message = rawMessage.slice(split + 2);
    }
  }

  return {
    id: row.id,
    keys: row.dedupeKeys,
    name: row.name ?? "",
    company: row.objektart ?? "",
    branche,
    email: row.email ?? "",
    phone: row.phone,
    website: row.flaeche ?? "",
    interest: (row.goals[0] as InterestValue | undefined) ?? null,
    message,
    submittedAt: row.createdAt.toISOString(),
  };
}

/**
 * Persist a B2B partner inquiry if none of its contact keys already exist
 * for source="partner" inside the dedupe window.
 *
 * Extra fields reuse existing CRM columns: company → objektart,
 * website → flaeche, interest → goals[0], branche prefixed onto message.
 */
export async function savePartnerInquiry(input: {
  keys: string[];
  name: string;
  company: string;
  branche: string;
  email: string;
  phone: string | null;
  website: string;
  interest: InterestValue | null;
  message: string;
}): Promise<SavePartnerResult> {
  const since = new Date(Date.now() - DEDUPE_WINDOW_MS);
  const existing = await prisma.inquiry.findFirst({
    where: {
      source: "partner",
      dedupeKeys: { hasSome: input.keys },
      createdAt: { gte: since },
    },
    orderBy: { createdAt: "desc" },
  });
  if (existing) return { status: "duplicate", inquiry: fromRow(existing) };

  const created = await prisma.inquiry.create({
    data: {
      source: "partner",
      dedupeKeys: input.keys,
      name: input.name,
      objektart: input.company,
      flaeche: input.website || null,
      goals: input.interest ? [input.interest] : [],
      message: composePartnerMessage(input.branche, input.message) || null,
      phone: input.phone,
      email: input.email,
    },
  });
  return { status: "created", inquiry: fromRow(created) };
}
