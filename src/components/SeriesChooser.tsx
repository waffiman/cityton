"use client";

import { useMemo, useState } from "react";
import SeriesCard from "./SeriesCard";
import type { Series } from "@/content/series";
import { SERIES_GOALS, type SeriesGoal, seriesMatchesGoal } from "@/lib/series-goals";
import styles from "./SeriesChooser.module.css";

/**
 * /produkte series list, filtered by what the customer actually wants to solve.
 * Mirrors the chip pattern in FilmCatalog; defaults to "alle" so nothing is
 * hidden before the visitor chooses.
 */
export default function SeriesChooser({ series }: { series: Series[] }) {
  const [goal, setGoal] = useState<SeriesGoal>("alle");

  const visible = useMemo(
    () => series.filter((s) => seriesMatchesGoal(s.slug, goal)),
    [series, goal],
  );

  return (
    <div>
      <div className={styles.chooser} role="group" aria-label="Serien nach Ziel filtern">
        <div className={styles.chips}>
          {SERIES_GOALS.map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={goal === value ? styles.chipOn : styles.chip}
              aria-pressed={goal === value}
              onClick={() => setGoal(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.list}>
        {visible.length === 0 ? (
          <p className={styles.empty}>Für dieses Ziel ist derzeit keine Serie hinterlegt.</p>
        ) : (
          visible.map((item) => <SeriesCard key={item.slug} item={item} />)
        )}
      </div>
    </div>
  );
}
