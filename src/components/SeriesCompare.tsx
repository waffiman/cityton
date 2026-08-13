"use client";

import Link from "next/link";
import InfoHint from "./InfoHint";
import type { Series } from "@/content/series";
import styles from "./SeriesCompare.module.css";

export default function SeriesCompare({ items }: { items: Series[] }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.scroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col" className={styles.corner}>
                Serie
              </th>
              {items.map((s) => (
                <th key={s.slug} scope="col">
                  <Link href={`/produkte/${s.slug}`} className={styles.seriesLink}>
                    {s.name}
                  </Link>
                  <span className={styles.tag}>{s.tag}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Familie</th>
              {items.map((s) => (
                <td key={`${s.slug}-fam`}>{s.family}</td>
              ))}
            </tr>
            <tr>
              <th scope="row">Einsatz</th>
              {items.map((s) => (
                <td key={`${s.slug}-use`}>{s.useCases.join(" · ")}</td>
              ))}
            </tr>
            {Array.from(
              new Set(items.flatMap((s) => s.metrics.map((m) => m.label))),
            ).map((label) => (
              <tr key={label}>
                <th scope="row">
                  <span className={styles.metricLabel}>
                    {label}
                    <InfoHint term={label} />
                  </span>
                </th>
                {items.map((s) => {
                  const metric = s.metrics.find((x) => x.label === label);
                  if (!metric) return <td key={`${s.slug}-${label}`}>—</td>;
                  return (
                    <td key={`${s.slug}-${label}`}>
                      <div className={styles.metricValue}>{metric.value}</div>
                      <div className={styles.track} aria-hidden="true">
                        <div className={styles.fill} style={{ width: `${metric.bar}%` }} />
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
