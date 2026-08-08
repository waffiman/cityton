/** Rating stars — decorative; the numeric rating carries the meaning. */
export default function Stars({ size = 13 }: { size?: number }) {
  return (
    <div style={{ display: "flex", gap: size > 15 ? 3 : 2 }} aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill="var(--color-signal)">
          <path d="M12 2l3 7h7l-5.5 4.3L18.5 21 12 16.8 5.5 21l2-7.7L2 9h7l3-7z" />
        </svg>
      ))}
    </div>
  );
}
