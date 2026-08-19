import { prisma } from "@/lib/db";

export type StoredLead = {
  /** Dedup key: `email:…` or `phone:+43…` */
  key: string;
  kind: "email" | "phone";
  /** Trimmed value as submitted (only contact identifier). */
  contact: string;
  submittedAt: string;
};

export type SaveLeadResult =
  | { status: "created"; lead: StoredLead }
  | { status: "duplicate"; lead: StoredLead };

type LeadRow = {
  dedupeKeys: string[];
  phone: string | null;
  email: string | null;
  createdAt: Date;
};

function toStored(row: LeadRow): StoredLead {
  const kind: "email" | "phone" = row.email ? "email" : "phone";
  return {
    key: row.dedupeKeys[0] ?? "",
    kind,
    contact: (kind === "email" ? row.email : row.phone) ?? "",
    submittedAt: row.createdAt.toISOString(),
  };
}

/**
 * Repeat submissions are only treated as duplicates inside this window. Without
 * a bound, a customer who ever wrote once could never contact us again.
 */
const DEDUPE_WINDOW_MS = 24 * 60 * 60 * 1000;

/**
 * Persist a beratung lead if its normalized key is new.
 * Backed by Postgres (CRM `Inquiry` table, source="beratung").
 */
export async function saveLead(input: {
  key: string;
  kind: "email" | "phone";
  contact: string;
}): Promise<SaveLeadResult> {
  const since = new Date(Date.now() - DEDUPE_WINDOW_MS);
  const existing = await prisma.inquiry.findFirst({
    where: {
      source: "beratung",
      dedupeKeys: { has: input.key },
      createdAt: { gte: since },
    },
    orderBy: { createdAt: "desc" },
  });
  if (existing) return { status: "duplicate", lead: toStored(existing) };

  const created = await prisma.inquiry.create({
    data: {
      source: "beratung",
      dedupeKeys: [input.key],
      phone: input.kind === "phone" ? input.contact : null,
      email: input.kind === "email" ? input.contact : null,
    },
  });
  return { status: "created", lead: toStored(created) };
}
