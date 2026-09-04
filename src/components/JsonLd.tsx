/**
 * Renders a JSON-LD block. Server-only — the payload is built from trusted
 * repo/DB values, but `<` is still escaped so a stray angle bracket in
 * admin-authored copy (a post title, say) can't close the script element.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
