import { Link } from "@/i18n/navigation";
import { CertificationBadge } from "./CertificationBadge";
import { cn } from "@/lib/utils";
import {
  formatMetricPercent,
  formatUv,
  type ProductSeries,
} from "@/content/products";

type ProductCardProps = {
  product: ProductSeries;
  locale: string;
  name: string;
  tagline: string;
  technology: string;
  certifiedLabel?: string;
  learnMoreLabel: string;
  tserLabel: string;
  vltLabel: string;
  uvLabel: string;
  className?: string;
};

function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-bg-soft px-2.5 py-1 text-xs font-medium text-teal-dark ring-1 ring-border">
      <span className="mr-1 text-text-muted">{label}</span>
      {value}
    </span>
  );
}

export function ProductCard({
  product,
  locale,
  name,
  tagline,
  technology,
  certifiedLabel,
  learnMoreLabel,
  tserLabel,
  vltLabel,
  uvLabel,
  className,
}: ProductCardProps) {
  return (
    <article
      className={cn(
        "group flex h-full flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-border transition hover:-translate-y-0.5 hover:shadow-md",
        className,
      )}
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h3 className="text-lg font-semibold text-teal-dark">{name}</h3>
        {product.certified && certifiedLabel ? (
          <CertificationBadge label={certifiedLabel} />
        ) : null}
      </div>
      <p className="text-sm font-medium text-teal">{tagline}</p>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-text-muted">
        {technology}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {product.metrics.tser ? (
          <MetricPill
            label={tserLabel}
            value={formatMetricPercent(locale, product.metrics.tser)}
          />
        ) : null}
        {product.metrics.vlt ? (
          <MetricPill
            label={vltLabel}
            value={formatMetricPercent(locale, product.metrics.vlt)}
          />
        ) : null}
        <MetricPill
          label={uvLabel}
          value={formatUv(locale, product.metrics.uv)}
        />
      </div>
      <Link
        href={`/products/${product.slug}`}
        className="mt-5 inline-flex items-center text-sm font-semibold text-teal transition group-hover:text-teal-dark"
      >
        {learnMoreLabel}
        <span aria-hidden className="ml-1 transition group-hover:translate-x-0.5">
          →
        </span>
      </Link>
    </article>
  );
}
