import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type StoredLead = {
  /** Dedup key: `email:…` or `phone:+43…` */
  key: string;
  kind: "email" | "phone";
  /** Trimmed value as submitted (only contact identifier). */
  contact: string;
  submittedAt: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_PATH = path.join(DATA_DIR, "beratung-leads.json");

type StoreFile = { leads: StoredLead[] };

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
    if (!parsed || !Array.isArray(parsed.leads)) return { leads: [] };
    return parsed;
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "ENOENT") return { leads: [] };
    throw err;
  }
}

async function writeStore(store: StoreFile): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(STORE_PATH, `${JSON.stringify(store, null, 2)}\n`, "utf8");
}

export type SaveLeadResult =
  | { status: "created"; lead: StoredLead }
  | { status: "duplicate"; lead: StoredLead };

/**
 * Persist a lead if its normalized key is new. Concurrent callers are serialized
 * so double-clicks cannot insert the same key twice.
 */
export function saveLead(input: {
  key: string;
  kind: "email" | "phone";
  contact: string;
}): Promise<SaveLeadResult> {
  return withLock(async () => {
    const store = await readStore();
    const existing = store.leads.find((l) => l.key === input.key);
    if (existing) return { status: "duplicate", lead: existing };

    const lead: StoredLead = {
      key: input.key,
      kind: input.kind,
      contact: input.contact,
      submittedAt: new Date().toISOString(),
    };
    store.leads.push(lead);
    await writeStore(store);
    return { status: "created", lead };
  });
}
