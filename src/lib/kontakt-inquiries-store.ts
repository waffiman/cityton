import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { GoalValue, ObjektartValue } from "@/content/kontakt";

export type StoredInquiry = {
  id: string;
  /** Dedup keys present on this inquiry (`email:…` / `phone:…`). */
  keys: string[];
  name: string;
  objektart: ObjektartValue;
  flaeche: string;
  goals: GoalValue[];
  phone: string | null;
  email: string | null;
  submittedAt: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_PATH = path.join(DATA_DIR, "kontakt-inquiries.json");

type StoreFile = { inquiries: StoredInquiry[] };

let queue: Promise<unknown> = Promise.resolve();

function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function readStore(): Promise<StoreFile> {
  try {
    const raw = await readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as StoreFile;
    if (!parsed || !Array.isArray(parsed.inquiries)) return { inquiries: [] };
    return parsed;
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "ENOENT") return { inquiries: [] };
    throw err;
  }
}

async function writeStore(store: StoreFile): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(STORE_PATH, `${JSON.stringify(store, null, 2)}\n`, "utf8");
}

export type SaveInquiryResult =
  | { status: "created"; inquiry: StoredInquiry }
  | { status: "duplicate"; inquiry: StoredInquiry };

/**
 * Persist an inquiry if none of its contact keys already exist.
 * Concurrent callers are serialized.
 */
export function saveInquiry(input: {
  keys: string[];
  name: string;
  objektart: ObjektartValue;
  flaeche: string;
  goals: GoalValue[];
  phone: string | null;
  email: string | null;
}): Promise<SaveInquiryResult> {
  return withLock(async () => {
    const store = await readStore();
    const existing = store.inquiries.find((row) =>
      row.keys.some((k) => input.keys.includes(k)),
    );
    if (existing) return { status: "duplicate", inquiry: existing };

    const inquiry: StoredInquiry = {
      id: `inq_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
      keys: input.keys,
      name: input.name,
      objektart: input.objektart,
      flaeche: input.flaeche,
      goals: input.goals,
      phone: input.phone,
      email: input.email,
      submittedAt: new Date().toISOString(),
    };
    store.inquiries.push(inquiry);
    await writeStore(store);
    return { status: "created", inquiry };
  });
}
