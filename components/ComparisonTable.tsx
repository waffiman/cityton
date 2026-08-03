"use client";

import { useLocale, useTranslations } from "next-intl";
import { CertificationBadge } from "./CertificationBadge";
import {
  formatMetricPercent,
  formatUv,
  products,
  SECURITY_STANDARD,
} from "@/content/products";
import { cn } from "@/lib/utils";

type ComparisonTableProps = {
  className?: string;
};

export function ComparisonTable({ className }: ComparisonTableProps) {
  const t = useTranslations("products");
  const tc = useTranslations("common");
  const tp = useTranslations("products_content");
  const locale = useLocale();

  return (
    <div className={cn("w-full", className)}>
      <div className="hidden overflow-x-auto rounded-2xl ring-1 ring-border md:block">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead className="bg-bg-soft text-teal-dark">
            <tr>
              <th className="px-4 py-3 font-semibold">{tc("series")}</th>
              <th className="px-4 py-3 font-semibold">{tc("technology")}</th>
              <th className="px-4 py-3 font-semibold">{tc("keyMetrics")}</th>
              <th className="px-4 py-3 font-semibold">{tc("idealFor")}</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.slug} className="border-t border-border align-top">
                <td className="px-4 py-4">
                  <div className="font-semibold text-teal-dark">
                    {tp(`${p.slug}.name`)}
                  </div>
                  {p.certified ? (
                    <div className="mt-2">
                      <CertificationBadge
                        label={tc("certified")}
                        standard={SECURITY_STANDARD}
                      />
                    </div>
                  ) : null}
                  {p.metrics.thickness ? (
                    <div className="mt-2 text-xs text-text-muted">
                      {t("thickness")}: {p.metrics.thickness}
                    </div>
                  ) : null}
                </td>
                <td className="px-4 py-4 text-text-muted">
                  {tp(`${p.slug}.technology`)}
                </td>
                <td className="px-4 py-4">
                  <ul className="space-y-1 text-teal-dark">
                    {p.metrics.tser ? (
                      <li>
                        {tc("tser")}{" "}
                        {formatMetricPercent(locale, p.metrics.tser)}
                      </li>
                    ) : null}
                    {p.metrics.vlt ? (
                      <li>
                        {tc("vlt")} {formatMetricPercent(locale, p.metrics.vlt)}
                      </li>
                    ) : null}
                    <li>
                      {tc("uvProtection")} {formatUv(locale, p.metrics.uv)}
                    </li>
                  </ul>
                </td>
                <td className="px-4 py-4 text-text-muted">
                  {tp(`${p.slug}.idealFor`)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-4 md:hidden">
        {products.map((p) => (
          <div
            key={p.slug}
            className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-border"
          >
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-teal-dark">
                {tp(`${p.slug}.name`)}
              </h3>
              {p.certified ? (
                <CertificationBadge
                  label={tc("certified")}
                  standard={SECURITY_STANDARD}
                />
              ) : null}
            </div>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="font-medium text-teal-dark">{tc("technology")}</dt>
                <dd className="mt-1 text-text-muted">
                  {tp(`${p.slug}.technology`)}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-teal-dark">{tc("keyMetrics")}</dt>
                <dd className="mt-1 text-text-muted">
                  {[
                    p.metrics.tser &&
                      `${tc("tser")} ${formatMetricPercent(locale, p.metrics.tser)}`,
                    p.metrics.vlt &&
                      `${tc("vlt")} ${formatMetricPercent(locale, p.metrics.vlt)}`,
                    `${tc("uvProtection")} ${formatUv(locale, p.metrics.uv)}`,
                    p.metrics.thickness &&
                      `${t("thickness")}: ${p.metrics.thickness}`,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-teal-dark">{tc("idealFor")}</dt>
                <dd className="mt-1 text-text-muted">
                  {tp(`${p.slug}.idealFor`)}
                </dd>
              </div>
            </dl>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-text-muted">{t("legend")}</p>
    </div>
  );
}
