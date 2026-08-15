import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Film, FilmValues } from "@/content/series";
import { site } from "@/content/site";
import { allFilmSlugs, filmImageSrc, getFilmBySlug } from "@/lib/films";
import styles from "./film.module.css";

export function generateStaticParams() {
  return allFilmSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const film = getFilmBySlug(slug);
  if (!film) return {};
  return {
    title: `${film.name} · ${film.brand}`,
    description: `${film.brand} ${film.name} (${film.code}) — ${film.family}, Montage ${film.mount}. Kennwerte und Beratung bei City-Ton Austria.`,
  };
}

function pct(n: number): string {
  return `${n} %`;
}

function dec(n: number): string {
  return String(n).replace(".", ",");
}

function thickness(f: Film): string | null {
  if (f.thicknessMil && f.thicknessMicron) return `${f.thicknessMil} mil (${f.thicknessMicron} µ)`;
  if (f.thicknessMil) return `${f.thicknessMil} mil`;
  if (f.thicknessMicron) return `${f.thicknessMicron} µ`;
  return null;
}

type Row = { label: string; value: string };

function valueRows(v: FilmValues): Row[] {
  const rows: Row[] = [
    { label: "VLT (Lichtdurchlass)", value: pct(v.vlt) },
    { label: "TSER (Sonnenenergie abgewiesen)", value: pct(v.tser) },
    { label: "UV-Durchlass", value: `${v.uv} %` },
  ];
  if (v.glare != null) rows.push({ label: "Blendschutz", value: pct(v.glare) });
  if (v.solarTransmission != null) rows.push({ label: "Strahlungsdurchlass", value: pct(v.solarTransmission) });
  if (v.solarReflection != null) rows.push({ label: "Strahlungsreflexion außen", value: pct(v.solarReflection) });
  if (v.solarAbsorption != null) rows.push({ label: "Strahlungsabsorption", value: pct(v.solarAbsorption) });
  if (v.visibleReflection != null) rows.push({ label: "Lichtreflexion", value: pct(v.visibleReflection) });
  if (v.visibleReflectionExt != null) rows.push({ label: "Lichtreflexion außen", value: pct(v.visibleReflectionExt) });
  if (v.visibleReflectionInt != null) rows.push({ label: "Lichtreflexion innen", value: pct(v.visibleReflectionInt) });
  if (v.sc != null) rows.push({ label: "Abschirmgrad (SC)", value: dec(v.sc) });
  if (v.g != null) rows.push({ label: "g-Wert", value: dec(v.g) });
  if (v.emissivity != null) rows.push({ label: "Emissivität", value: dec(v.emissivity) });
  if (v.uValue != null) rows.push({ label: "Ug-Wert (EN 673)", value: `${dec(v.uValue)} W/m²K` });
  if (v.colourRendering != null) rows.push({ label: "Farbwiedergabe", value: String(v.colourRendering) });
  return rows;
}

const FAMILY_LABEL: Record<Film["family"], string> = {
  reflektierend: "Reflektierend",
  sputtered: "Sputtered / Nano",
  "dual-reflektierend": "Dual-reflektierend",
  spektralselektiv: "Spektralselektiv",
  "low-e": "Low-E",
  klar: "Klar",
  sicherheit: "Sicherheit",
  sichtschutz: "Sichtschutz",
};

export default async function FilmPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const film = getFilmBySlug(slug);
  if (!film) notFound();

  const image = filmImageSrc(film);
  const thick = thickness(film);
  const metaRows: Row[] = [
    { label: "Marke", value: film.brand },
    { label: "Code", value: film.code },
    { label: "Familie", value: FAMILY_LABEL[film.family] },
    { label: "Montage", value: film.mount },
  ];
  if (thick) metaRows.push({ label: "Stärke", value: thick });
  if (film.application) metaRows.push({ label: "Typische Anwendung", value: film.application });
  if (film.certification) metaRows.push({ label: "Prüfung", value: film.certification });

  return (
    <>
      <section className={`section--1 ${styles.band}`}>
        <div className="container">
          <nav className={styles.crumbs} aria-label="Brotkrumen">
            <Link href="/">HOME</Link>
            <span>/</span>
            <Link href="/produkte">PRODUKTE</Link>
            <span>/</span>
            <span className={styles.crumbCurrent}>{film.name.toUpperCase()}</span>
          </nav>

          <div className={styles.head}>
            <div>
              <p className={styles.kicker}>
                {film.brand} · {FAMILY_LABEL[film.family]}
              </p>
              <h1 className={styles.title}>{film.name}</h1>
              <p className={styles.sub}>
                {film.code} · Montage {film.mount}
              </p>

              <dl className={styles.meta}>
                {metaRows.map((r) => (
                  <div key={r.label} className={styles.metaRow}>
                    <dt>{r.label}</dt>
                    <dd>{r.value}</dd>
                  </div>
                ))}
              </dl>

              <Link href="/kontakt" className={`btn btn-primary btn-lg ${styles.cta}`}>
                {site.cta}
              </Link>
            </div>

            {image ? (
              <figure className={styles.hero}>
                <Image
                  src={image}
                  alt={`${film.brand} ${film.name}`}
                  fill
                  sizes="(max-width: 900px) 100vw, 48vw"
                  className={styles.heroImg}
                  priority
                />
              </figure>
            ) : (
              <div className={styles.heroEmpty} aria-hidden="true" />
            )}
          </div>
        </div>
      </section>

      <section className={`section--2 ${styles.band}`}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Kennwerte · Einfachverglasung</h2>
          <dl className={styles.specGrid}>
            {valueRows(film.single).map((r) => (
              <div key={r.label} className={styles.specRow}>
                <dt>{r.label}</dt>
                <dd>{r.value}</dd>
              </div>
            ))}
          </dl>

          {film.dual ? (
            <>
              <h2 className={styles.sectionTitle}>Kennwerte · Isolierglas</h2>
              <dl className={styles.specGrid}>
                {valueRows(film.dual).map((r) => (
                  <div key={`d-${r.label}`} className={styles.specRow}>
                    <dt>{r.label}</dt>
                    <dd>{r.value}</dd>
                  </div>
                ))}
              </dl>
            </>
          ) : null}

          <p className={styles.disclaimer}>
            Werte laut Herstellerdaten / Musterbuch. Vor dem Angebot gegen das aktuelle Datenblatt
            prüfen.
          </p>

          <Link href="/kontakt" className="btn btn-primary">
            Beratung zu dieser Folie anfragen
          </Link>
        </div>
      </section>
    </>
  );
}
