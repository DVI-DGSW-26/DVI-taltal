"use client";

import { useMemo } from "react";
import { Heart, RotateCcw } from "lucide-react";
import { useCategories, useProgramQueryState } from "@/lib/hooks";
import { REGION_ORDER, categoryLabelMap, regionLabel } from "@/lib/labels";

function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function dateToIso(date: string, isEnd: boolean): string | undefined {
  if (!date) return undefined;
  return `${date}T${isEnd ? "23:59:59" : "00:00:00"}+09:00`;
}

function isoToDate(iso: string | undefined): string {
  if (!iso) return "";
  return iso.slice(0, 10);
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-sm transition-colors ${
        active
          ? "border-brand-500 bg-brand-500 text-white"
          : "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
      }`}
    >
      {children}
    </button>
  );
}

export function Filters() {
  const { query, patch, push } = useProgramQueryState();
  const { data: categories } = useCategories();

  const categoryOptions = useMemo(() => {
    const map = categoryLabelMap(categories);
    if (categories && categories.length > 0) {
      return categories.map((c) => ({ code: c.code, label: c.label }));
    }
    return Object.entries(map).map(([code, label]) => ({ code, label }));
  }, [categories]);

  const hasFilters =
    query.q ||
    query.categories.length > 0 ||
    query.regions.length > 0 ||
    query.period_start ||
    query.period_end ||
    typeof query.favorite === "boolean" ||
    query.similar;

  return (
    <div className="space-y-5 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <section>
        <h2 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">지역</h2>
        <div className="flex flex-wrap gap-1.5">
          {REGION_ORDER.map((code) => (
            <Chip
              key={code}
              active={query.regions.includes(code)}
              onClick={() => patch({ regions: toggle(query.regions, code) })}
            >
              {regionLabel(code)}
            </Chip>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">카테고리</h2>
        <div className="flex flex-wrap gap-1.5">
          {categoryOptions.map(({ code, label }) => (
            <Chip
              key={code}
              active={query.categories.includes(code)}
              onClick={() => patch({ categories: toggle(query.categories, code) })}
            >
              {label}
            </Chip>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">신청 마감일</h2>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="date"
            aria-label="마감일 시작"
            value={isoToDate(query.period_start)}
            onChange={(e) => patch({ period_start: dateToIso(e.target.value, false) })}
            className="rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-900"
          />
          <span className="text-gray-400">~</span>
          <input
            type="date"
            aria-label="마감일 끝"
            value={isoToDate(query.period_end)}
            onChange={(e) => patch({ period_end: dateToIso(e.target.value, true) })}
            className="rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-900"
          />
        </div>
      </section>

      <section className="flex items-center justify-between">
        <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={query.favorite === true}
            onChange={(e) => patch({ favorite: e.target.checked ? true : undefined })}
            className="peer sr-only"
          />
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 peer-checked:border-red-400 peer-checked:bg-red-50 peer-checked:text-red-600 peer-focus-visible:ring-2 peer-focus-visible:ring-gray-400 dark:border-gray-700 dark:peer-checked:bg-red-900/20">
            <Heart
              size={15}
              aria-hidden
              className={query.favorite === true ? "fill-red-500 text-red-500" : ""}
            />
            관심만 보기
          </span>
        </label>

        {hasFilters && (
          <button
            type="button"
            onClick={() =>
              push({
                q: "",
                categories: [],
                regions: [],
                period_start: undefined,
                period_end: undefined,
                favorite: undefined,
                similar: false,
                page: 1,
                size: query.size,
              })
            }
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800"
          >
            <RotateCcw size={15} aria-hidden />
            초기화
          </button>
        )}
      </section>
    </div>
  );
}
