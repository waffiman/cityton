/**
 * Apply the English catalog translations in prisma/translations.en.json.
 *
 * German is the source language and stays in the bare columns; this fills the
 * `*En` siblings. Categories are translated through a single string map rather
 * than a per-row mirror: the same terms ("UV-Schutz", "Stärke", "Verletzungs-
 * schutz") recur across series, and one map keeps them consistent everywhere
 * instead of drifting between six near-copies.
 *
 * The map is applied to every string in a category — name, family, tag,
 * extraTag, summary, useCases, metric labels, and recursively through the
 * `detail` JSON. Strings that are pure measurements ("87 %", "12 mil (300 µ)")
 * are locale-independent and pass through untouched.
 *
 * Anything else without an entry is reported as MISSING and left in German, so
 * a run doubles as the coverage report. Idempotent: re-running rewrites the
 * same values.
 *
 *   npx tsx scripts/import-translations.ts [--dry-run]
 */

import "dotenv/config";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

type Translations = {
  strings: Record<string, string>;
  /** Per-code override, for the rare product whose wording needs its own text. */
  products?: Record<string, { application?: string; certification?: string }>;
};

/**
 * A value that reads the same in both languages: numbers, percentages, film
 * thicknesses, standard names, product codes. Never reported as missing.
 */
function localeIndependent(s: string): boolean {
  const t = s.trim();
  if (t === "") return true;
  // "87 %", "1500 mm", "12 mil (300 µ)", "100–300 µ", "> 99 %", "0,42"
  if (/^[<>≤≥~]?\s*[\d.,–—-]+\s*(%|µ|mm|mil|m²|W\/m²K|°C|nm)?(\s*\([^)]*\))?$/u.test(t)) return true;
  // "EN 356", "DIN EN 12600", "P1A", "Klasse 2 (B) 2" handled via the map when
  // they carry a German word; a bare standard or class code does not.
  if (/^(DIN\s+)?EN\s*[\d\s]+$/.test(t)) return true;
  if (/^P\d[A-Z]?$/.test(t)) return true;
  return false;
}

const missing = new Set<string>();

function tr(map: Record<string, string>, value: string): string {
  const hit = map[value];
  if (hit !== undefined) return hit;
  if (!localeIndependent(value)) missing.add(value);
  return value;
}

/**
 * Keys whose values are identifiers, not prose, and must survive untranslated.
 *
 * `variants.films` holds whole Film records; FilmCard localizes those itself by
 * looking `family` / `mount` up as message keys, so rewriting them here would
 * turn every card's label into a missing-key error rather than English.
 */
const PASS_THROUGH_KEYS = new Set(["films"]);

/** Deep-copy `node`, translating every string through the map. */
function translateDeep(map: Record<string, string>, node: unknown): unknown {
  if (typeof node === "string") return tr(map, node);
  if (Array.isArray(node)) return node.map((v) => translateDeep(map, v));
  if (node && typeof node === "object") {
    return Object.fromEntries(
      Object.entries(node).map(([k, v]) => [
        k,
        PASS_THROUGH_KEYS.has(k) ? v : translateDeep(map, v),
      ]),
    );
  }
  return node;
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const file = path.join(process.cwd(), "prisma", "translations.en.json");
  const t = JSON.parse(await readFile(file, "utf8")) as Translations;
  const map = t.strings;

  const cats = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
  for (const c of cats) {
    const data = {
      nameEn: tr(map, c.name),
      familyEn: tr(map, c.family),
      tagEn: tr(map, c.tag),
      extraTagEn: c.extraTag ? tr(map, c.extraTag) : null,
      summaryEn: tr(map, c.summary),
      useCasesEn: c.useCases.map((u) => tr(map, u)),
      metricsEn: translateDeep(map, c.metrics ?? null) as object,
      detailEn: translateDeep(map, c.detail ?? null) as object,
    };
    if (!dryRun) await prisma.category.update({ where: { id: c.id }, data });
    console.log(`  category ${c.slug.padEnd(24)} -> ${data.nameEn}`);
  }

  const prods = await prisma.product.findMany({
    where: { OR: [{ application: { not: null } }, { certification: { not: null } }] },
    orderBy: { code: "asc" },
  });
  // Product prose reuses the same map — "Südfassade" is the same phrase whether
  // it labels a series use case or a film's typical application, and one entry
  // keeps the two from drifting apart. A per-code override wins where given.
  let done = 0;
  for (const p of prods) {
    const override = t.products?.[p.code];
    const applicationEn = override?.application ?? (p.application ? tr(map, p.application) : null);
    const certificationEn =
      override?.certification ?? (p.certification ? tr(map, p.certification) : null);
    if (!dryRun) {
      await prisma.product.update({
        where: { id: p.id },
        data: { applicationEn, certificationEn },
      });
    }
    done += 1;
  }
  console.log(`\n  products translated: ${done}/${prods.length}`);

  if (missing.size > 0) {
    console.log(`\nMISSING (${missing.size}) — still served in German:`);
    for (const m of [...missing].sort()) console.log(`  ${JSON.stringify(m)}: "",`);
  } else {
    console.log("\nNo untranslated strings remain.");
  }
  if (dryRun) console.log("\n(dry run — nothing written)");
  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error(err);
  process.exitCode = 1;
  await prisma.$disconnect();
});
