import Image from "next/image";
import type { Metadata } from "next";
import Corners from "@/components/Corners";
import { about } from "@/content/about";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "Über uns",
  description: about.body.slice(0, 155),
};

export default function AboutPage() {
  return (
    <>
      <section className="container" style={{ paddingTop: 56 }}>
        <div className={styles.intro}>
          <div>
            <h6 className="eyebrow">{about.eyebrow}</h6>
            <h1 className={styles.title}>{about.title}</h1>
            <p className="lead">{about.body}</p>
          </div>
          <figure className={`blueprint duotone ${styles.portrait}`}>
            <Corners />
            <Image
              src={about.image.src}
              alt={about.image.alt}
              fill
              sizes="(max-width: 900px) 100vw, 45vw"
              className={styles.portraitImg}
            />
          </figure>
        </div>
      </section>

      <section className="container section">
        <blockquote className={`blueprint ${styles.quotePlate}`}>
          <Corners />
          <p className={styles.quote}>{about.quote}</p>
          <footer className={styles.quoteMeta}>{about.quoteMeta.toUpperCase()}</footer>
        </blockquote>
      </section>

      <section className="container section">
        <div className="rule-head">
          <h6 className="eyebrow">Partnerschaft</h6>
        </div>
        <div className={styles.partnerGrid}>
          {about.partners.map((p) => (
            <div
              key={p.title}
              className={`card blueprint ${styles.partnerCard} ${p.highlight ? styles.partnerHighlight : ""}`}
            >
              <Corners />
              <div className="card-kicker">{p.kicker}</div>
              <div className="card-title" style={{ fontSize: 20 }}>
                {p.title}
              </div>
              <p className="card-body" style={{ fontSize: 14 }}>
                {p.body}
              </p>
              {p.link && (
                <a href={p.link.href} style={{ fontSize: 13 }} target="_blank" rel="noreferrer">
                  {p.link.label}
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="rule-head">
          <h6 className="eyebrow">Vorteile der Zusammenarbeit</h6>
        </div>
        <div className={styles.advantageGrid}>
          {about.advantages.map((a) => (
            <div key={a.title} className={`card blueprint ${styles.advantageCard}`}>
              <Corners />
              <div className="card-title" style={{ fontSize: 19 }}>
                {a.title}
              </div>
              <p className="card-body" style={{ fontSize: 14 }}>
                {a.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
