"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { clientApi } from "@/lib/api";
import { queryKeys } from "@/lib/query";
import { parseProgramQuery, programQueryToString } from "@/lib/url";
import type { ProgramQuery } from "@/lib/types";

export function useProgramQueryState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = useMemo<ProgramQuery>(() => {
    const obj: Record<string, string | string[]> = {};
    for (const key of searchParams.keys()) {
      const all = searchParams.getAll(key);
      obj[key] = all.length > 1 ? all : (all[0] ?? "");
    }
    return parseProgramQuery(obj);
  }, [searchParams]);

  const push = useCallback(
    (next: ProgramQuery) => {
      router.replace(`${pathname}${programQueryToString(next)}`, { scroll: false });
    },
    [router, pathname],
  );

  const patch = useCallback(
    (partial: Partial<ProgramQuery>, resetPage = true) => {
      push({ ...query, ...partial, ...(resetPage ? { page: 1 } : {}) });
    },
    [push, query],
  );

  return { query, patch, push };
}

export function useCategories(includeInactive = false) {
  return useQuery({
    queryKey: queryKeys.categories(includeInactive),
    queryFn: () => clientApi.categories(includeInactive),
    staleTime: 10 * 60_000,
  });
}

export function useCrawlStatus() {
  return useQuery({
    queryKey: queryKeys.crawlStatus(),
    queryFn: () => clientApi.crawlStatus(),
    refetchInterval: (q) => (q.state.data?.running ? 20_000 : 60_000),
    refetchOnWindowFocus: true,
  });
}
