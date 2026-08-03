"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ProductCard } from "@/components/ProductCard";
import {
  products,
  type UseCaseFilter,
} from "@/content/products";

type SortKey = "name" | "tser" | "vlt";

export function ProductCatalog() {
  const t = useTranslations("products");
  const tc = useTranslations("common");
  const tp = useTranslations("products_content");
  const locale = useLocale();

  const [filter, setFilter] = useState<UseCaseFilter | "all">("all");
  const [sort, setSort] = useState<SortKey>("name");

  const filtered = useMemo(() => {
    let list = [...products];
    if (filter !== "all") {
      list = list.filter((p) => p.filters.includes(filter));
    }
    list.sort((a, b) => {
      if (sort === "tser") return b.tserMax - a.tserMax;
      if (sort === "vlt") return b.vltMax - a.vltMax;
      return tp(`${a.slug}.name`).localeCompare(tp(`${b.slug}.name`));
    });
    return list;
  }, [filter, sort, tp]);

  const filters: { id: UseCaseFilter | "all"; label: string }[] = [
    { id: "all", label: tc("all") },
    { id: "solar", label: t("filterSolar") },
    { id: "uv", label: t("filterUv") },
    { id: "security", label: t("filterSecurity") },
    { id: "clarity", label: t("filterClarity") },
  ];

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label={tc("filterBy")}>
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={
                filter === f.id
                  ? "rounded-full bg-teal px-3 py-1.5 text-sm font-semibold text-white"
                  : "rounded-full bg-white px-3 py-1.5 text-sm font-medium text-teal-dark ring-1 ring-border hover:bg-bg-soft"
              }
            >
              {f.label}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm text-text-muted">
          <span>{tc("sortBy")}</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-lg border border-border bg-white px-3 py-1.5 text-teal-dark"
          >
            <option value="name">{t("sortName")}</option>
            <option value="tser">{t("sortTser")}</option>
            <option value="vlt">{t("sortVlt")}</option>
          </select>
        </label>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map((p) => (
          <ProductCard
            key={p.slug}
            product={p}
            locale={locale}
            name={tp(`${p.slug}.name`)}
            tagline={tp(`${p.slug}.tagline`)}
            technology={tp(`${p.slug}.technology`)}
            certifiedLabel={tc("certified")}
            learnMoreLabel={tc("learnMore")}
            tserLabel={tc("tser")}
            vltLabel={tc("vlt")}
            uvLabel={tc("uvProtection")}
          />
        ))}
      </div>
    </div>
  );
}
