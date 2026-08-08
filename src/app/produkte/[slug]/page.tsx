import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Corners from "@/components/Corners";
import SeriesGlyph from "@/components/diagrams/SeriesGlyph";
import { getSeries, series } from "@/content/series";
import { site } from "@/content/site";
import styles from "./series.module.css";

export function generateStaticParams() {
  return series.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getSeries(slug);
  if (!item) return {};
  return {
    title: item.name,
    description: item.summary,
  };
}

export default async function SeriesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getSeries(slug);
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
              {stats.map((s) => (
                <div key={s.label} className={styles.stat}>
                  <div className={styles.statLabel}>{s.label.toUpperCase()}</div>
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

          {d?.hero ? (
            <figure className={`blueprint ${styles.hero}`}>
              <Corners />
              <Image
                src={d.hero.src}
                alt={d.hero.alt}
                fill
                priority
                sizes="(max-width: 1000px) 100vw, 45vw"
                className={styles.heroImg}
              />
            </figure>
          ) : (
            <div className={`blueprint ${styles.glyphPlate}`}>
              <Corners />
              <SeriesGlyph variant={item.glyph} field="paper" />
            </div>
          )}
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
            <h6 className="eyebrow">Varianten der {item.name}</h6>
          </div>
          <div className={styles.tableWrap}>
            <table className="table">
              <thead>
                <tr>
                  {d.variants.columns.map((c) => (
                    <th key={c}>{c}</th>
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
        </section>
      )}

      {d?.figures && (
        <section className="container" style={{ paddingTop: 44 }}>
          <div className={styles.figureGrid}>
            {d.figures.map((f) => (
              <figure key={f.src} className={`blueprint duotone ${styles.figure}`}>
                <Corners />
                <div className={styles.figureMedia}>
                  <Image src={f.src} alt={f.alt} fill sizes="(max-width: 1000px) 100vw, 50vw" className={styles.figureImg} />
                </div>
                <figcaption>{f.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {!d && (
        <section className="container section">
          <div className={`blueprint ${styles.pending}`}>
            <Corners />
            <h6 className="eyebrow">Datenblatt in Arbeit</h6>
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
