import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Film, FilmValues } from "@/content/series";
import { getProductBySlug } from "@/lib/products";
import { pageAlternates } from "@/lib/seo";
import styles from "./film.module.css";

// Rendered per request from the DB (no build-time database dependency).
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const film = await getProductBySlug(slug);
  if (!film) return {};
  return {
    title: `${film.name} · ${film.brand}`,
    description: `${film.brand} ${film.name} (${film.code}) — ${film.family}, Montage ${film.mount}. Kennwerte und Beratung bei City-Ton Austria.`,
    // Content is DB-sourced German only — see pageAlternates' doc comment.
    alternates: pageAlternates(`/produkte/folie/${slug}`, "de", { hasEnglish: false }),
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
type T = Awaited<ReturnType<typeof getTranslations>>;

function valueRows(v: FilmValues, t: T): Row[] {
  const rows: Row[] = [
    { label: t("vlt"), value: pct(v.vlt) },
    { label: t("tser"), value: pct(v.tser) },
    { label: t("uvDurchlass"), value: `${v.uv} %` },
  ];
  if (v.glare != null) rows.push({ label: t("blendschutz"), value: pct(v.glare) });
  if (v.solarTransmission != null) rows.push({ label: t("strahlungsdurchlass"), value: pct(v.solarTransmission) });
  if (v.solarReflection != null) rows.push({ label: t("strahlungsreflexionAussen"), value: pct(v.solarReflection) });
  if (v.solarAbsorption != null) rows.push({ label: t("strahlungsabsorption"), value: pct(v.solarAbsorption) });
  if (v.visibleReflection != null) rows.push({ label: t("lichtreflexion"), value: pct(v.visibleReflection) });
  if (v.visibleReflectionExt != null) rows.push({ label: t("lichtreflexionAussen"), value: pct(v.visibleReflectionExt) });
  if (v.visibleReflectionInt != null) rows.push({ label: t("lichtreflexionInnen"), value: pct(v.visibleReflectionInt) });
  if (v.sc != null) rows.push({ label: t("abschirmgrad"), value: dec(v.sc) });
  if (v.g != null) rows.push({ label: t("gWert"), value: dec(v.g) });
  if (v.emissivity != null) rows.push({ label: t("emissivitaet"), value: dec(v.emissivity) });
  if (v.uValue != null) rows.push({ label: t("ugWert"), value: `${dec(v.uValue)} W/m²K` });
  if (v.colourRendering != null) rows.push({ label: t("farbwiedergabe"), value: String(v.colourRendering) });
  return rows;
}

export default async function FilmPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const film = await getProductBySlug(slug);
  if (!film) notFound();

  const [t, tc] = await Promise.all([
    getTranslations("produkteFolieDetail"),
    getTranslations("common"),
  ]);

  const image = film.imageUrl;
  const thick = thickness(film);
  const familyLabel = t(`family.${film.family}`);
  const metaRows: Row[] = [
    { label: t("marke"), value: film.brand },
    { label: t("code"), value: film.code },
    { label: t("familie"), value: familyLabel },
    { label: t("montage"), value: film.mount },
  ];
  if (thick) metaRows.push({ label: t("staerke"), value: thick });
  if (film.application) metaRows.push({ label: t("anwendung"), value: film.application });
  if (film.certification) metaRows.push({ label: t("pruefung"), value: film.certification });

  return (
    <>
      <section className={`section--1 ${styles.band}`}>
        <div className="container">
          <nav className={styles.crumbs} aria-label={tc("breadcrumbAriaLabel")}>
            <Link href="/">{tc("breadcrumbHome")}</Link>
            <span>/</span>
            <Link href="/produkte">{tc("breadcrumbProdukte")}</Link>
            <span>/</span>
            <span className={styles.crumbCurrent}>{film.name.toUpperCase()}</span>
          </nav>

          <div className={styles.head}>
            <div>
              <p className={styles.kicker}>
                {film.brand} · {familyLabel}
              </p>
              <h1 className={styles.title}>{film.name}</h1>
              <p className={styles.sub}>
                {film.code} · {t("montagePrefix")} {film.mount}
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
                {t("ctaLabel")}
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
                  unoptimized
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
          <h2 className={styles.sectionTitle}>{t("kennwerteEinfach")}</h2>
          <dl className={styles.specGrid}>
            {valueRows(film.single, t).map((r) => (
              <div key={r.label} className={styles.specRow}>
                <dt>{r.label}</dt>
                <dd>{r.value}</dd>
              </div>
            ))}
          </dl>

          {film.dual ? (
            <>
              <h2 className={styles.sectionTitle}>{t("kennwerteIso")}</h2>
              <dl className={styles.specGrid}>
                {valueRows(film.dual, t).map((r) => (
                  <div key={`d-${r.label}`} className={styles.specRow}>
                    <dt>{r.label}</dt>
                    <dd>{r.value}</dd>
                  </div>
                ))}
              </dl>
            </>
          ) : null}

          <Link href="/kontakt" className="btn btn-primary">
            {t("ctaLabel")}
          </Link>
        </div>
      </section>
    </>
  );
}
