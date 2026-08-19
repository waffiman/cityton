import Link from "next/link";
import Corners from "./Corners";
import SeriesGlyph from "./diagrams/SeriesGlyph";
import type { Series } from "@/content/series";
import styles from "./SeriesCard.module.css";

/** One row of the series overview: glyph plate · copy · metric bars. */
export default function SeriesCard({ item }: { item: Series }) {
  return (
    <Link href={`/produkte/${item.slug}`} className={`card blueprint ${styles.row}`}>
      <Corners />

      <div className={item.glyphField === "dark" ? styles.plateDark : styles.platePaper}>
        <SeriesGlyph variant={item.glyph} field={item.glyphField} />
      </div>

      <div className={styles.body}>
        <div className={styles.tags}>
          <span className="tag tag-accent">{item.tag.toUpperCase()}</span>
          {item.extraTag && (
            <span className="tag tag-outline" style={{ fontSize: 10 }}>
              {item.extraTag.toUpperCase()}
            </span>
          )}
        </div>
        <div className={`card-title ${styles.name}`}>{item.name}</div>
        <div className={styles.family}>{item.family}</div>
        <p className={`card-body ${styles.summary}`}>{item.summary}</p>
      </div>

      <div className={styles.metrics}>
        {item.metrics.map((m) => (
          <div key={m.label}>
            <div className={styles.metricHead}>
              <span className={styles.metricLabel}>{m.label}</span>
              <span className={styles.metricValue}>{m.value}</span>
            </div>
            <div className={styles.track}>
              <div className={styles.fill} style={{ width: `${m.bar}%` }} />
            </div>
          </div>
        ))}
        <span className={styles.more}>MEHR ERFAHREN →</span>
      </div>
    </Link>
  );
}
