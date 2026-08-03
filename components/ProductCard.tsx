import { Link } from "@/i18n/navigation";
import { CertificationBadge } from "./CertificationBadge";
import { ProductSignature } from "./ProductSignature";
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

function MetricBar({
  label,
  value,
  pct,
}: {
  label: string;
  value: string;
  pct: number;
}) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-xs">
        <span className="text-text-muted">{label}</span>
        <span className="font-semibold text-teal-dark">{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-bg-soft">
        <div
          className="h-full rounded-full bg-teal"
          style={{ width: `${Math.max(4, Math.min(100, pct))}%` }}
        />
      </div>
    </div>
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
        "group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-border transition hover:-translate-y-0.5 hover:shadow-md",
        className,
      )}
    >
      <div className="overflow-hidden">
        <ProductSignature slug={product.slug} compact />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <h3 className="text-lg font-semibold text-ink">{name}</h3>
          {product.certified && certifiedLabel ? (
            <CertificationBadge label={certifiedLabel} />
          ) : null}
        </div>
        <p className="text-sm font-medium text-teal">{tagline}</p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-text-muted">
          {technology}
        </p>
        <div className="mt-4 space-y-2">
          {product.metrics.tser ? (
            <MetricBar
              label={tserLabel}
              value={formatMetricPercent(locale, product.metrics.tser)}
              pct={product.tserMax}
            />
          ) : null}
          {product.metrics.vlt ? (
            <MetricBar
              label={vltLabel}
              value={formatMetricPercent(locale, product.metrics.vlt)}
              pct={product.vltMax}
            />
          ) : null}
          <MetricBar
            label={uvLabel}
            value={formatUv(locale, product.metrics.uv)}
            pct={Math.min(100, product.uvProtection)}
          />
        </div>
        <Link
          href={`/products/${product.slug}`}
          className="mt-5 inline-flex items-center text-sm font-semibold text-teal transition group-hover:text-teal-dark"
        >
          {learnMoreLabel}
          <span
            aria-hidden
            className="ml-1 transition group-hover:translate-x-0.5"
          >
            →
          </span>
        </Link>
      </div>
    </article>
  );
}
