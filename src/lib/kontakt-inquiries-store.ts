import type { GoalValue, ObjektartValue } from "@/content/kontakt";
import { prisma } from "@/lib/db";

export type StoredInquiry = {
  id: string;
  /** Dedup keys present on this inquiry (`email:…` / `phone:…`). */
  keys: string[];
  name: string;
  objektart: ObjektartValue;
  flaeche: string;
  goals: GoalValue[];
  message: string;
  phone: string | null;
  email: string | null;
  submittedAt: string;
};

export type SaveInquiryResult =
  | { status: "created"; inquiry: StoredInquiry }
  | { status: "duplicate"; inquiry: StoredInquiry };

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

function toStored(row: InquiryRow): StoredInquiry {
  return {
    id: row.id,
    keys: row.dedupeKeys,
    name: row.name ?? "",
    objektart: (row.objektart ?? "") as ObjektartValue,
    flaeche: row.flaeche ?? "",
    goals: row.goals as GoalValue[],
    message: row.message ?? "",
    phone: row.phone,
    email: row.email,
    submittedAt: row.createdAt.toISOString(),
  };
}

/**
 * Repeat submissions are only treated as duplicates inside this window. Without
 * a bound, a customer who ever wrote once could never contact us again.
 */
const DEDUPE_WINDOW_MS = 24 * 60 * 60 * 1000;

/**
 * Persist a kontakt inquiry if none of its contact keys already exist.
 * Backed by Postgres (CRM `Inquiry` table, source="kontakt").
 */
export async function saveInquiry(input: {
  keys: string[];
  name: string;
  objektart: ObjektartValue;
  flaeche: string;
  goals: GoalValue[];
  message: string;
  phone: string | null;
  email: string | null;
}): Promise<SaveInquiryResult> {
  const since = new Date(Date.now() - DEDUPE_WINDOW_MS);
  const existing = await prisma.inquiry.findFirst({
    where: {
      source: "kontakt",
      dedupeKeys: { hasSome: input.keys },
      createdAt: { gte: since },
    },
    orderBy: { createdAt: "desc" },
  });
  if (existing) return { status: "duplicate", inquiry: toStored(existing) };

  const created = await prisma.inquiry.create({
    data: {
      source: "kontakt",
      dedupeKeys: input.keys,
      name: input.name,
      objektart: input.objektart,
      flaeche: input.flaeche,
      goals: input.goals,
      message: input.message,
      phone: input.phone,
      email: input.email,
    },
  });
  return { status: "created", inquiry: toStored(created) };
}
