import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import Corners from "@/components/Corners";
import CtaBand from "@/components/CtaBand";
import FilmCard from "@/components/FilmCard";
import FilmStructure from "@/components/FilmStructure";
import InfoHint from "@/components/InfoHint";
import SeriesGlyph from "@/components/diagrams/SeriesGlyph";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import { Link } from "@/i18n/navigation";
import { seriesCertificates } from "@/content/certificates";
import { structureForSeries } from "@/content/film-structure";
import { seriesVideos } from "@/content/series-videos";
import { shouldBypassOptimizer } from "@/lib/films";
import { getSeriesBySlug } from "@/lib/products";
import { pageAlternates } from "@/lib/seo";
import filmCatalogStyles from "@/components/FilmCatalog.module.css";
import styles from "./series.module.css";

// Rendered per request from the DB (no build-time database dependency).
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getSeriesBySlug(slug);
  if (!item) return {};
  return {
    title: item.name,
    description: item.summary,
    // Content is DB-sourced German only — see pageAlternates' doc comment.
    alternates: pageAlternates(`/produkte/${slug}`, "de", { hasEnglish: false }),
  };
}

export default async function SeriesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getSeriesBySlug(slug);
  if (!item) notFound();

  const [t, tc, tsite, tStructure] = await Promise.all([
    getTranslations("produkteSeriePage"),
    getTranslations("common"),
    getTranslations("site"),
    getTranslations("filmStructure"),
  ]);

  const d = item.detail;
  const stats: { label: string; value: string; note: string }[] =
    d?.stats ?? item.metrics.map((m) => ({ label: m.label, value: m.value, note: "" }));
  const structure = structureForSeries(item.slug, tStructure, d?.structure);
  const certificates = seriesCertificates[item.slug];
  const videos = seriesVideos[item.slug];

  return (
    <div className={styles.page}>
      <section className={`section--3 ${styles.heroBand}`}>
        <div className="diagonal-fx" aria-hidden="true">
          <span className="diagonal-sheet" />
          <span className="diagonal-sheet" />
          <span className="diagonal-sheet" />
          <span className="diagonal-orb" />
        </div>
        <div className={`container ${styles.heroInner}`}>
        <nav className={styles.crumbs} aria-label={tc("breadcrumbAriaLabel")}>
          <Link href="/">{tc("breadcrumbHome")}</Link>
          <span>/</span>
          <Link href="/produkte">{tc("breadcrumbProdukte")}</Link>
          <span>/</span>
          <span className={styles.crumbCurrent}>{item.name.toUpperCase()}</span>
        </nav>

        <div className={styles.head}>
          <div>
            <span className="tag tag-accent">
              {(d?.kicker ?? `${item.tag} · ${item.family}`).toUpperCase()}
            </span>
            <h1 className={styles.title}>{item.name}</h1>
            <p className={styles.intro}>{d?.intro ?? item.summary}</p>

            <div className={`blueprint ${styles.stats}`}>
              <Corners />
              {stats.map((s, i) => (
                <div key={`${s.label}-${i}`} className={styles.stat}>
                  <div className={styles.statLabel}>
                    {s.label.toUpperCase()}
                    <InfoHint term={s.label.startsWith("VLT") ? "VLT" : s.label} label={s.label} />
                  </div>
                  <div className={styles.statValue}>{s.value}</div>
                </div>
              ))}
            </div>

            <div className={styles.actions}>
              <Link href="/kontakt" className="btn btn-primary btn-lg blueprint">
                <Corners />
                {tsite("cta")}
              </Link>
              <Link href="/funktionsprinzip" className="btn btn-secondary btn-lg">
                {t("funktionsprinzipCta")}
              </Link>
            </div>
          </div>

          <div className={`blueprint ${styles.glyphPlate}`}>
            <Corners />
            <SeriesGlyph variant={item.glyph} field="paper" />
          </div>
        </div>
        </div>
      </section>

      {structure ? (
        <section className="section--1">
          <div className="container">
            <FilmStructure {...structure} />
          </div>
        </section>
      ) : null}

      {videos?.length ? (
        <section className="container section" aria-labelledby="videodemo">
          <h2 id="videodemo" className={styles.sectionTitle}>
            {t("videoSectionTitle")}
          </h2>
          <ul className={styles.videoList}>
            {videos.map((video) => (
              <li key={video.youtubeId}>
                <YouTubeEmbed
                  id={video.youtubeId}
                  title={video.title}
                  poster={video.poster}
                  credit={video.credit}
                />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {certificates?.length ? (
        <section className="container section" aria-labelledby="pruefberichte">
          <h2 id="pruefberichte" className={styles.sectionTitle}>
            {t("certsSectionTitle")}
          </h2>
          <ul className={styles.certsGrid}>
            {certificates.map((cert) => (
              <li key={cert.href}>
                <a
                  href={cert.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`blueprint ${styles.certCard}`}
                >
                  <Corners />
                  <span className={styles.certPreview}>
                    <Image
                      src={cert.preview}
                      alt={cert.caption}
                      fill
                      sizes="(max-width: 700px) 100vw, 25vw"
                      className={styles.certImg}
                      unoptimized={shouldBypassOptimizer(cert.preview)}
                    />
                    <span className={styles.certBrand}>{cert.brand}</span>
                  </span>
                  <span className={styles.certBody}>
                    <span className={styles.certStandard}>{cert.standard}</span>
                    <span className={styles.certResult}>{cert.result}</span>
                    <span className={styles.certMeta}>{cert.film}</span>
                    <span className={styles.certReport}>{cert.report}</span>
                    <span className={styles.certOpen}>{t("certPrefix")}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {d?.facts && (
        <section className="container section">
          <div className={styles.factGrid}>
            {d.facts.map((f) => (
              <div key={f.title} className={`card blueprint ${styles.factCard}`}>
                <Corners />
                <div className="card-kicker">{f.kicker}</div>
                <div className="card-title" style={{ fontSize: 19 }}>
                  {f.title}
                </div>
                <p className="card-body" style={{ fontSize: 14 }}>
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {d?.variants && (
        <section className="container section">
          <div className="rule-head">
          </div>
          <div className={styles.tableWrap}>
            <table className="table">
              <thead>
                <tr>
                  {d.variants.columns.map((c, i) => (
                    <th key={`${c}-${i}`}>
                      <span className={styles.colHead}>
                        {c}
                        <InfoHint term={c} label={c} />
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {d.variants.rows.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, i) => (
                      <td key={i}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {d.variants.films.length > 0 && (
            <div className={styles.variantFilms}>
              <div className="rule-head">
              </div>
              <ul className={filmCatalogStyles.grid}>
                {d.variants.films.map((film) => (
                  <li key={film.code}>
                    <FilmCard film={film} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {!d && (
        <section className={`container section ${styles.end}`}>
          <div className={`blueprint ${styles.pending}`}>
            <Corners />
            <p style={{ margin: 0, maxWidth: "56ch" }}>
              {t("pendingText", { name: item.name })}
            </p>
            <Link href="/kontakt" className={`btn btn-secondary ${styles.pendingCta}`}>
              {tsite("cta")}
            </Link>
          </div>
        </section>
      )}

      <CtaBand title={tc("ctaFilmTitle")} body={tc("ctaFilmBody")} />
    </div>
  );
}
