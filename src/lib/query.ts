import { QueryClient } from "@tanstack/react-query";

export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        gcTime: 5 * 60_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
}

export const queryKeys = {
  programs: (key: string) => ["programs", key] as const,
  program: (id: number) => ["program", id] as const,
  categories: (includeInactive: boolean) => ["categories", includeInactive] as const,
  crawlStatus: () => ["crawl-status"] as const,
  blacklist: (includeExpired: boolean) => ["blacklist", includeExpired] as const,
};
