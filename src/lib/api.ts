import type { Category, CrawlStatus, Program, ProgramPage, ProgramQuery } from "@/lib/types";

const CLIENT_BASE = (process.env.NEXT_PUBLIC_API_BASE ?? "/api").replace(/\/+$/, "");

const SERVER_BASE = (process.env.API_BASE ?? "http://localhost:9522").replace(/\/+$/, "");

export const apiUrl = (path: string): string =>
  `${CLIENT_BASE}${path.startsWith("/") ? path : `/${path}`}`;

export const serverUrl = (path: string): string =>
  `${SERVER_BASE}${path.startsWith("/") ? path : `/${path}`}`;

export class ApiError extends Error {
  constructor(
    public status: number,
    public detail: unknown,
  ) {
    super(typeof detail === "string" ? detail : `요청 실패 (${status})`);
    this.name = "ApiError";
  }
}

export function errorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    const d = err.detail;
    if (typeof d === "string") return d;
    if (Array.isArray(d) && d.length > 0) {
      const first = d[0] as { msg?: string } | undefined;
      if (first?.msg) return first.msg;
    }
    return `요청 실패 (${err.status})`;
  }
  if (err instanceof Error) return err.message;
  return "알 수 없는 오류가 발생했습니다.";
}

export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });

  if (!res.ok) {
    let detail: unknown = null;
    try {
      const body = (await res.json()) as { detail?: unknown };
      detail = body?.detail ?? body;
    } catch {
      detail = res.statusText;
    }
    throw new ApiError(res.status, detail);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export function buildProgramParams(query: Partial<ProgramQuery>): URLSearchParams {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  for (const c of query.categories ?? []) params.append("categories", c);
  for (const r of query.regions ?? []) params.append("regions", r);
  if (query.period_start) params.set("period_start", query.period_start);
  if (query.period_end) params.set("period_end", query.period_end);
  if (typeof query.favorite === "boolean") params.set("favorite", String(query.favorite));
  params.set("page", String(query.page ?? 1));
  params.set("size", String(query.size ?? 21));
  return params;
}

function programsPath(query: Partial<ProgramQuery>): string {
  const base = query.similar ? "/programs/similar-search" : "/programs";
  return `${base}?${buildProgramParams(query)}`;
}

export const clientApi = {
  programs: (query: Partial<ProgramQuery>): Promise<ProgramPage> =>
    fetchJson<ProgramPage>(apiUrl(programsPath(query))),

  program: (id: number): Promise<Program> => fetchJson<Program>(apiUrl(`/programs/${id}`)),

  setFavorite: (id: number, isFavorite: boolean): Promise<Program> =>
    fetchJson<Program>(apiUrl(`/programs/${id}/favorite`), {
      method: "PATCH",
      body: JSON.stringify({ is_favorite: isFavorite }),
    }),

  categories: (includeInactive = false): Promise<Category[]> =>
    fetchJson<Category[]>(apiUrl(`/categories?include_inactive=${includeInactive}`)),

  crawlStatus: (): Promise<CrawlStatus> => fetchJson<CrawlStatus>(apiUrl("/crawl/status")),
};

export const serverApi = {
  programs: (query: Partial<ProgramQuery>): Promise<ProgramPage> =>
    fetchJson<ProgramPage>(serverUrl(programsPath(query)), { cache: "no-store" }),

  program: (id: number): Promise<Program> =>
    fetchJson<Program>(serverUrl(`/programs/${id}`), { cache: "no-store" }),

  categories: (includeInactive = false): Promise<Category[]> =>
    fetchJson<Category[]>(serverUrl(`/categories?include_inactive=${includeInactive}`), {
      next: { revalidate: 600, tags: ["categories"] },
    }),
};
