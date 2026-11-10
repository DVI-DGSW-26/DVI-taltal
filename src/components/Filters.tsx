"use client";

import { useMemo, useState } from "react";
import { Heart, RotateCcw } from "lucide-react";
import { useCategories, useProgramQueryState } from "@/lib/hooks";
import { REGION_ORDER, categoryLabelMap, periodLabel, regionLabel } from "@/lib/labels";
import type { PeriodType } from "@/lib/types";

const NO_DEADLINE_PERIOD_TYPES: PeriodType[] = ["ROLLING", "UNTIL_BUDGET", "UNKNOWN"];

function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function sameSet(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const set = new Set(b);
  return a.every((v) => set.has(v));
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
      className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "border-brand bg-brand text-on-brand"
          : "border-line text-fg-muted hover:bg-surface-2 hover:text-fg"
      }`}
    >
      {children}
    </button>
  );
}

export function Filters() {
  const { query, patch, push } = useProgramQueryState();
  const { data: categories } = useCategories();

  const [optimisticRegions, setOptimisticRegions] = useState<string[] | null>(null);
  const [optimisticCategories, setOptimisticCategories] = useState<string[] | null>(null);
  const [optimisticPeriodTypes, setOptimisticPeriodTypes] = useState<PeriodType[] | null>(null);
  const [optimisticFavorite, setOptimisticFavorite] = useState<{
    value: boolean | undefined;
  } | null>(null);

  if (optimisticRegions !== null && sameSet(optimisticRegions, query.regions)) {
    setOptimisticRegions(null);
  }
  if (optimisticCategories !== null && sameSet(optimisticCategories, query.categories)) {
    setOptimisticCategories(null);
  }
  if (optimisticPeriodTypes !== null && sameSet(optimisticPeriodTypes, query.period_types)) {
    setOptimisticPeriodTypes(null);
  }
  if (optimisticFavorite !== null && optimisticFavorite.value === query.favorite) {
    setOptimisticFavorite(null);
  }

  const activeRegions = optimisticRegions ?? query.regions;
  const activeCategories = optimisticCategories ?? query.categories;
  const activePeriodTypes = optimisticPeriodTypes ?? query.period_types;
  const activeFavorite = optimisticFavorite ? optimisticFavorite.value : query.favorite;

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
    query.period_types.length > 0 ||
    typeof query.favorite === "boolean" ||
    query.similar;

  return (
    <div className="border-edge bg-surface space-y-5 rounded-xl border p-5">
      <section>
        <h2 className="text-fg mb-2 text-sm font-semibold">지역</h2>
        <div className="flex flex-wrap gap-2">
          {REGION_ORDER.map((code) => (
            <Chip
              key={code}
              active={activeRegions.includes(code)}
              onClick={() => {
                const next = toggle(activeRegions, code);
                setOptimisticRegions(next);
                patch({ regions: next });
              }}
            >
              {regionLabel(code)}
            </Chip>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-fg mb-2 text-sm font-semibold">카테고리</h2>
        <div className="flex flex-wrap gap-2">
          {categoryOptions.map(({ code, label }) => (
            <Chip
              key={code}
              active={activeCategories.includes(code)}
              onClick={() => {
                const next = toggle(activeCategories, code);
                setOptimisticCategories(next);
                patch({ categories: next });
              }}
            >
              {label}
            </Chip>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-fg mb-2 text-sm font-semibold">신청 마감일</h2>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="date"
            aria-label="마감일 시작"
            value={isoToDate(query.period_start)}
            onChange={(e) => patch({ period_start: dateToIso(e.target.value, false) })}
            className="border-line-strong bg-surface text-fg hover:border-fg-subtle h-10 rounded-md border px-3 text-sm"
          />
          <span className="text-fg-subtle">~</span>
          <input
            type="date"
            aria-label="마감일 끝"
            value={isoToDate(query.period_end)}
            onChange={(e) => patch({ period_end: dateToIso(e.target.value, true) })}
            className="border-line-strong bg-surface text-fg hover:border-fg-subtle h-10 rounded-md border px-3 text-sm"
          />
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {NO_DEADLINE_PERIOD_TYPES.map((pt) => (
            <Chip
              key={pt}
              active={activePeriodTypes.includes(pt)}
              onClick={() => {
                const next = activePeriodTypes.includes(pt)
                  ? activePeriodTypes.filter((v) => v !== pt)
                  : [...activePeriodTypes, pt];
                setOptimisticPeriodTypes(next);
                patch({ period_types: next });
              }}
            >
              {periodLabel(pt)}
            </Chip>
          ))}
        </div>
      </section>

      <section className="flex items-center justify-between">
        <label className="text-fg-muted inline-flex cursor-pointer items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={activeFavorite === true}
            onChange={(e) => {
              const next = e.target.checked ? true : undefined;
              setOptimisticFavorite({ value: next });
              patch({ favorite: next });
            }}
            className="peer sr-only"
          />
          <span className="border-line-strong hover:bg-surface-2 peer-checked:border-danger peer-checked:bg-danger-soft peer-checked:text-danger-fg peer-focus-visible:ring-brand-line inline-flex h-9 items-center gap-1.5 rounded-md border px-3 peer-focus-visible:ring-2">
            <Heart
              size={16}
              aria-hidden
              className={activeFavorite === true ? "fill-danger text-danger" : ""}
            />
            관심만 보기
          </span>
        </label>

        {hasFilters && (
          <button
            type="button"
            onClick={() => {
              setOptimisticRegions([]);
              setOptimisticCategories([]);
              setOptimisticPeriodTypes([]);
              setOptimisticFavorite({ value: undefined });
              push({
                q: "",
                categories: [],
                regions: [],
                period_start: undefined,
                period_end: undefined,
                period_types: [],
                favorite: undefined,
                similar: false,
                page: 1,
                size: query.size,
              });
            }}
            className="text-fg-muted hover:bg-surface-2 hover:text-fg inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-sm font-medium"
          >
            <RotateCcw size={16} aria-hidden />
            초기화
          </button>
        )}
      </section>
    </div>
  );
}
