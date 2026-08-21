/**
 * Seed the admin database from the current hardcoded content.
 *
 * Source of truth today: src/content/series.ts (films + series, fully derived)
 * and src/lib/films.ts (slugs, katalog image resolution). We copy the computed
 * values verbatim so the public pages render identically once they read the DB.
 *
 * Idempotent: uses upsert on unique slugs/codes, so re-running is safe.
 */

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { films, series, type Film } from "../src/content/series.ts";
import { filmImageSrc, filmSlug } from "../src/lib/films.ts";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

/** Map a film's brand to the producer we created. */
const PRODUCERS = [
  { name: "Armolan", slug: "armolan", sortOrder: 0 },
  { name: "LLumar", slug: "llumar", sortOrder: 1 },
] as const;

async function main() {
  // 1. Producers
  const producerIdByName = new Map<string, string>();
  for (const p of PRODUCERS) {
    const row = await prisma.producer.upsert({
      where: { slug: p.slug },
      update: { name: p.name, sortOrder: p.sortOrder },
      create: { name: p.name, slug: p.slug, sortOrder: p.sortOrder },
    });
    producerIdByName.set(p.name, row.id);
  }

  // 2. Categories (series) — remember which film codes belong to each, via detail.variants.films
  const categoryIdByFilmCode = new Map<string, string>();
  const currentSlugs = series.map((s) => s.slug);
  for (let i = 0; i < series.length; i++) {
    const s = series[i];
    const row = await prisma.category.upsert({
      where: { slug: s.slug },
      update: {
        name: s.name,
        family: s.family,
        tag: s.tag,
        extraTag: s.extraTag ?? null,
        summary: s.summary,
        glyph: s.glyph,
        glyphField: s.glyphField,
        useCases: s.useCases,
        metrics: s.metrics as object,
        detail: (s.detail ?? null) as object,
        sortOrder: i,
      },
      create: {
        slug: s.slug,
        name: s.name,
        family: s.family,
        tag: s.tag,
        extraTag: s.extraTag ?? null,
        summary: s.summary,
        glyph: s.glyph,
        glyphField: s.glyphField,
        useCases: s.useCases,
        metrics: s.metrics as object,
        detail: (s.detail ?? null) as object,
        sortOrder: i,
      },
    });
    for (const f of s.detail?.variants?.films ?? []) {
      categoryIdByFilmCode.set(f.code, row.id);
    }
  }

  // A renamed slug (e.g. arm-platinum-spectrum → spektralselektive) leaves the
  // old row behind — upsert only ever creates/updates, never deletes. Hide
  // anything no longer in `series` rather than deleting it, so no product
  // history is lost and a typo'd rename is trivially reversible.
  const { count: hidden } = await prisma.category.updateMany({
    where: { slug: { notIn: currentSlugs } },
    data: { visible: false },
  });
  if (hidden > 0) console.log(`Hid ${hidden} categorie(s) no longer in src/content/series.ts.`);

  // 3. Products (films)
  for (let i = 0; i < films.length; i++) {
    const f: Film = films[i];
    const producerId = producerIdByName.get(f.brand);
    if (!producerId) throw new Error(`No producer for brand ${f.brand}`);
    const slug = filmSlug(f.code);
    const data = {
      name: f.name,
      slug,
      family: f.family,
      mount: f.mount,
      thicknessMil: f.thicknessMil ?? null,
      thicknessMicron: f.thicknessMicron ?? null,
      application: f.application ?? null,
      certification: f.certification ?? null,
      note: f.note ?? null,
      single: f.single as object,
      dual: (f.dual ?? null) as object,
      imageUrl: filmImageSrc(f),
      sortOrder: i,
      producerId,
      categoryId: categoryIdByFilmCode.get(f.code) ?? null,
    };
    await prisma.product.upsert({
      where: { code: f.code },
      update: data,
      create: { code: f.code, ...data },
    });
  }

  const [producers, categories, products] = await Promise.all([
    prisma.producer.count(),
    prisma.category.count(),
    prisma.product.count(),
  ]);
  console.log(`Seeded: ${producers} producers, ${categories} categories, ${products} products.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
