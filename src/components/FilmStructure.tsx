"use client";

import { useState } from "react";
import type { FilmStructureContent } from "@/content/film-structure";
import styles from "./FilmStructure.module.css";

export default function FilmStructure({ title, layers }: FilmStructureContent) {
  const [active, setActive] = useState<number | null>(null);

  const set = (n: number | null) => () => setActive(n);

  return (
    <div className={styles.wrap}>
      <h2 className={styles.title}>{title}</h2>

      <div className={styles.schema} aria-label={`${title}: ${layers.length} Schichten`}>
        {layers.map((layer) => {
          const on = active === layer.n;
          return (
            <button
              key={layer.n}
              type="button"
              className={`${styles.row}${on ? ` ${styles.rowOn}` : ""}`}
              style={{ flexGrow: layer.weight ?? 1 }}
              onMouseEnter={set(layer.n)}
              onMouseLeave={set(null)}
              onFocus={set(layer.n)}
              onBlur={set(null)}
              aria-pressed={on}
            >
              <span className={styles.leader}>
                <span className={styles.num}>{layer.n}</span>
                <span className={styles.line} aria-hidden="true" />
                <span className={styles.lineLabel}>{layer.caption}</span>
              </span>
              <span className={styles.block} style={{ background: layer.color }} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
