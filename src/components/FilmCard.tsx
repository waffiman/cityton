import Image from "next/image";
import Link from "next/link";
import type { Film } from "@/content/series";
import { filmImageSrc, filmSlug } from "@/lib/films";
import styles from "./FilmCatalog.module.css";

/**
 * One product card: katalog swatch + brand + name, linking to the film's
 * detail page. Shared by `FilmCatalog` (the filterable "Alle Folien" grid)
 * and the per-series film list on `/produkte/[slug]` — one card, reused
 * everywhere a single film needs to be listed.
 */
export default function FilmCard({ film }: { film: Film }) {
  const src = filmImageSrc(film);
  return (
    <Link href={`/produkte/folie/${filmSlug(film.code)}`} className={styles.card}>
      <div className={styles.media}>
        {src ? (
          <Image
            src={src}
            alt=""
            fill
            sizes="(max-width: 700px) 50vw, 25vw"
            className={styles.img}
          />
        ) : (
          <span className={styles.mediaEmpty} />
        )}
      </div>
      <div className={styles.body}>
        <span className={styles.brand}>{film.brand}</span>
        <span className={styles.name}>{film.name}</span>
      </div>
    </Link>
  );
}
