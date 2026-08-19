import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Corners from "@/components/Corners";
import FilmCard from "@/components/FilmCard";
import InfoHint from "@/components/InfoHint";
import SeriesGlyph from "@/components/diagrams/SeriesGlyph";
import { site } from "@/content/site";
import { getSeriesBySlug } from "@/lib/products";
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
  };
}

export default async function SeriesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getSeriesBySlug(slug);
  if (!item) notFound();

  const d = item.detail;
  const stats: { label: string; value: string; note: string }[] =
    d?.stats ?? item.metrics.map((m) => ({ label: m.label, value: m.value, note: "" }));

  return (
    <>
      <section className="container" style={{ paddingTop: 44 }}>
        <nav className={styles.crumbs} aria-label="Brotkrumen">
          <Link href="/">HOME</Link>
          <span>/</span>
          <Link href="/produkte">PRODUKTE</Link>
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
                  {s.note && <div className={styles.statNote}>{s.note}</div>}
                </div>
              ))}
            </div>

            {d?.statsFootnote && <p className={styles.footnote}>{d.statsFootnote}</p>}

            <div className={styles.actions}>
              <Link href="/kontakt" className="btn btn-primary btn-lg blueprint">
                <Corners />
                {site.cta}
              </Link>
              <Link href="/funktionsprinzip" className="btn btn-secondary btn-lg">
                Funktionsprinzip ansehen
              </Link>
            </div>
          </div>

          <div className={`blueprint ${styles.glyphPlate}`}>
            <Corners />
            <SeriesGlyph variant={item.glyph} field="paper" />
          </div>
        </div>
      </section>

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
        <section className="container section">
          <div className={`blueprint ${styles.pending}`}>
            <Corners />
            <p style={{ margin: 0, maxWidth: "56ch" }}>
              Die ausführliche Produktseite für {item.name} folgt. Kennwerte, Varianten und
              Referenzobjekte kommen aus dem Herstellerdatenblatt — bis dahin beraten wir gerne
              direkt.
            </p>
            <Link href="/kontakt" className="btn btn-secondary" style={{ marginTop: 18 }}>
              {site.cta}
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
