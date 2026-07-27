"use client";

import { apiUrl, fetchJson } from "@/lib/api";
import type { BlacklistEntry, Category, CategoryCreate, CategoryUpdate } from "@/lib/types";

export const adminApi = {
  createCategory: (body: CategoryCreate): Promise<Category> =>
    fetchJson<Category>(apiUrl("/categories"), {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateCategory: (code: string, body: CategoryUpdate): Promise<Category> =>
    fetchJson<Category>(apiUrl(`/categories/${code}`), {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  deleteCategory: (code: string): Promise<{ status: string; code: string }> =>
    fetchJson(apiUrl(`/categories/${code}`), { method: "DELETE" }),

  reclassify: (): Promise<{ reclassified: number }> =>
    fetchJson(apiUrl("/categories/reclassify"), { method: "POST" }),

  hideProgram: (programId: number, reason?: string): Promise<BlacklistEntry> =>
    fetchJson<BlacklistEntry>(apiUrl(`/programs/${programId}/hide`), {
      method: "POST",
      body: JSON.stringify({ reason: reason ?? null }),
    }),

  blacklist: (includeExpired = false): Promise<BlacklistEntry[]> =>
    fetchJson<BlacklistEntry[]>(apiUrl(`/blacklist?include_expired=${includeExpired}`)),

  unhide: (blacklistId: number): Promise<{ status: string; id: number }> =>
    fetchJson(apiUrl(`/blacklist/${blacklistId}`), { method: "DELETE" }),

  triggerCrawl: (): Promise<{ status?: string } & Record<string, unknown>> =>
    fetchJson("/api/admin/crawl", { method: "POST" }),
};
