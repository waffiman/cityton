import styles from "./Faq.module.css";

/** Native <details> accordion — no JS, keyboard-accessible by default. */
export default function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className={styles.list}>
      {items.map((item) => (
        <details key={item.q} className={styles.item}>
          <summary className={styles.summary}>
            {item.q}
            <span className={styles.marker} aria-hidden="true" />
          </summary>
          <p className={styles.answer}>{item.a}</p>
        </details>
      ))}
    </div>
  );
}
