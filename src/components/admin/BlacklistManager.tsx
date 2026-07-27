"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EyeOff, Loader2, Undo2 } from "lucide-react";
import { adminApi } from "@/lib/admin";
import { errorMessage } from "@/lib/api";
import { queryKeys } from "@/lib/query";
import { formatDateTime } from "@/lib/format";

export function BlacklistManager() {
  const qc = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: queryKeys.blacklist(false),
    queryFn: () => adminApi.blacklist(false),
  });

  const unhide = useMutation({
    mutationFn: (id: number) => adminApi.unhide(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["blacklist"] });
      void qc.invalidateQueries({ queryKey: ["programs"] });
    },
  });

  return (
    <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
      <h2 className="flex items-center gap-2 text-base font-semibold">
        <EyeOff size={18} aria-hidden className="text-gray-400" />
        숨긴 공고
      </h2>

      {isError && <p className="text-sm text-red-600">{errorMessage(error)}</p>}

      <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200 dark:divide-gray-800 dark:border-gray-800">
        {isLoading && <li className="px-4 py-6 text-center text-sm text-gray-400">불러오는 중…</li>}
        {data?.map((entry) => (
          <li key={entry.id} className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{entry.title}</p>
              <p className="mt-0.5 text-xs text-gray-400">
                {entry.organization ? `${entry.organization} · ` : ""}
                {entry.reason ? `${entry.reason} · ` : ""}
                {formatDateTime(entry.expires_at)}까지 차단
              </p>
            </div>
            <button
              type="button"
              onClick={() => unhide.mutate(entry.id)}
              disabled={unhide.isPending}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-gray-300 px-2.5 py-1.5 text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-60 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {unhide.isPending && unhide.variables === entry.id ? (
                <Loader2 size={13} aria-hidden className="animate-spin" />
              ) : (
                <Undo2 size={13} aria-hidden />
              )}
              숨김 해제
            </button>
          </li>
        ))}
        {data?.length === 0 && (
          <li className="px-4 py-6 text-center text-sm text-gray-400">숨긴 공고가 없습니다.</li>
        )}
      </ul>
      <p className="text-xs text-gray-400">숨김을 해제하면 다음 수집 때 다시 목록에 포함됩니다.</p>
    </section>
  );
}
