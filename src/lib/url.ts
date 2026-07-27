import type { ProgramQuery } from "@/lib/types";

export const DEFAULT_SIZE = 21;

type RawSearchParams = Record<string, string | string[] | undefined>;

function asArray(v: string | string[] | undefined): string[] {
  if (v == null) return [];
  return Array.isArray(v) ? v : [v];
}

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export function parseProgramQuery(sp: RawSearchParams): ProgramQuery {
  const pageNum = Number(first(sp.page));
  const sizeNum = Number(first(sp.size));
  const favRaw = first(sp.favorite);

  return {
    q: (first(sp.q) ?? "").slice(0, 300),
    categories: asArray(sp.categories),
    regions: asArray(sp.regions),
    period_start: first(sp.period_start) || undefined,
    period_end: first(sp.period_end) || undefined,
    favorite: favRaw === "true" ? true : favRaw === "false" ? false : undefined,
    similar: first(sp.similar) === "true",
    page: Number.isFinite(pageNum) && pageNum >= 1 ? Math.floor(pageNum) : 1,
    size:
      Number.isFinite(sizeNum) && sizeNum >= 1 && sizeNum <= 100
        ? Math.floor(sizeNum)
        : DEFAULT_SIZE,
  };
}

export function programQueryToParams(q: ProgramQuery): URLSearchParams {
  const p = new URLSearchParams();
  if (q.q) p.set("q", q.q);
  for (const c of q.categories) p.append("categories", c);
  for (const r of q.regions) p.append("regions", r);
  if (q.period_start) p.set("period_start", q.period_start);
  if (q.period_end) p.set("period_end", q.period_end);
  if (typeof q.favorite === "boolean") p.set("favorite", String(q.favorite));
  if (q.similar) p.set("similar", "true");
  if (q.page > 1) p.set("page", String(q.page));
  if (q.size !== DEFAULT_SIZE) p.set("size", String(q.size));
  return p;
}

export function programQueryToString(q: ProgramQuery): string {
  const s = programQueryToParams(q).toString();
  return s ? `?${s}` : "";
}

export function programQueryKey(q: ProgramQuery): string {
  return programQueryToParams(q).toString();
}
