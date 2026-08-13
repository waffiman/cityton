"use client";

import { useMemo, useState } from "react";
import FilmCard from "./FilmCard";
import type { Film } from "@/content/series";
import { type BrandFilter, type MountFilter, filterFilms } from "@/lib/films";
import styles from "./FilmCatalog.module.css";

export default function FilmCatalog({ films }: { films: Film[] }) {
  const [brand, setBrand] = useState<BrandFilter>("alle");
  const [mount, setMount] = useState<MountFilter>("alle");

  const visible = useMemo(() => filterFilms(films, brand, mount), [films, brand, mount]);

  return (
    <div>
      <div className={styles.filters} role="group" aria-label="Folien filtern">
        <div className={styles.filterBlock}>
          <span className={styles.filterLabel}>Marke</span>
          <div className={styles.chips}>
            {(
              [
                ["alle", "Alle"],
                ["Armolan", "Armolan"],
                ["LLumar", "LLumar"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={brand === value ? styles.chipOn : styles.chip}
                aria-pressed={brand === value}
                onClick={() => setBrand(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.filterBlock}>
          <span className={styles.filterLabel}>Montage</span>
          <div className={styles.chips}>
            {(
              [
                ["alle", "Alle"],
                ["innen", "Innen"],
                ["außen", "Außen"],
                ["innen / außen", "Innen / Außen"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={mount === value ? styles.chipOn : styles.chip}
                aria-pressed={mount === value}
                onClick={() => setMount(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className={styles.count}>
        {visible.length} {visible.length === 1 ? "Folie" : "Folien"}
      </p>

      <ul className={styles.grid}>
        {visible.map((film) => (
          <li key={film.code}>
            <FilmCard film={film} />
          </li>
        ))}
      </ul>
    </div>
  );
}
