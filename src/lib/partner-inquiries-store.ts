import type { InterestValue } from "@/content/partner";
import { prisma } from "@/lib/db";

export type StoredPartnerInquiry = {
  id: string;
  keys: string[];
  name: string;
  company: string;
  branche: string;
  interest: InterestValue | null;
  website: string;
  message: string;
  phone: string | null;
  email: string;
  submittedAt: string;
};

export type SavePartnerResult =
  | { status: "created"; inquiry: StoredPartnerInquiry }
  | { status: "duplicate"; inquiry: StoredPartnerInquiry };

type InquiryRow = {
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
};

function toStored(row: InquiryRow): StoredPartnerInquiry {
  const goals = row.goals;
  return {
    id: row.id,
    keys: row.dedupeKeys,
    name: row.name ?? "",
    company: row.flaeche ?? "",
    branche: goals[0] ?? "",
    interest: (row.objektart as InterestValue | null) ?? null,
    website: goals[1] ?? "",
    message: row.message ?? "",
    phone: row.phone,
    email: row.email ?? "",
    submittedAt: row.createdAt.toISOString(),
  };
}

const DEDUPE_WINDOW_MS = 24 * 60 * 60 * 1000;

/**
 * Persist a B2B partner inquiry. Reuses Inquiry columns:
 * - flaeche → company
 * - objektart → interest key
 * - goals[0] → branche, goals[1] → website
 * - message → free-text note (structured header is also stored for mail/admin)
 */
export async function savePartnerInquiry(input: {
  keys: string[];
  name: string;
  company: string;
  branche: string;
  interest: InterestValue | null;
  website: string;
  message: string;
  phone: string | null;
  email: string;
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
  if (existing) return { status: "duplicate", inquiry: toStored(existing) };

  const created = await prisma.inquiry.create({
    data: {
      source: "partner",
      dedupeKeys: input.keys,
      name: input.name,
      flaeche: input.company,
      objektart: input.interest,
      goals: [input.branche, input.website].filter(Boolean),
      message: input.message,
      phone: input.phone,
      email: input.email,
    },
  });
  return { status: "created", inquiry: toStored(created) };
}
