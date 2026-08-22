"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import FilmCard from "./FilmCard";
import type { Film } from "@/content/series";
import { type BrandFilter, type MountFilter, filterFilms } from "@/lib/films";
import styles from "./FilmCatalog.module.css";

export default function FilmCatalog({
  films,
}: {
  films: (Film & { imageUrl?: string | null })[];
}) {
  const t = useTranslations("filmCatalog");
  const [brand, setBrand] = useState<BrandFilter>("alle");
  const [mount, setMount] = useState<MountFilter>("alle");

  const visible = useMemo(() => filterFilms(films, brand, mount), [films, brand, mount]);

  const brandOptions: [BrandFilter, string][] = [
    ["alle", t("all")],
    ["Armolan", "Armolan"],
    ["LLumar", "LLumar"],
  ];
  const mountOptions: [MountFilter, string][] = [
    ["alle", t("all")],
    ["innen", t("mountInnen")],
    ["außen", t("mountAussen")],
    ["innen / außen", t("mountBoth")],
  ];

  return (
    <div>
      <div className={styles.filters} role="group" aria-label={t("filterAriaLabel")}>
        <div className={styles.filterBlock}>
          <span className={styles.filterLabel}>{t("brand")}</span>
          <div className={styles.chips}>
            {brandOptions.map(([value, label]) => (
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
          <span className={styles.filterLabel}>{t("mount")}</span>
          <div className={styles.chips}>
            {mountOptions.map(([value, label]) => (
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
        {visible.length} {visible.length === 1 ? t("filmSingular") : t("filmPlural")}
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
