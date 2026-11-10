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
    <section className="border-edge bg-surface space-y-4 rounded-xl border p-5">
      <h2 className="text-fg flex items-center gap-2 text-base font-semibold">
        <EyeOff size={20} aria-hidden className="text-fg-subtle" />
        숨긴 공고
      </h2>

      {isError && <p className="text-danger-fg text-sm">{errorMessage(error)}</p>}

      <ul className="divide-line border-edge divide-y overflow-hidden rounded-xl border">
        {isLoading && (
          <li className="text-fg-subtle px-4 py-10 text-center text-sm">불러오는 중…</li>
        )}
        {data?.map((entry) => (
          <li key={entry.id} className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              <p className="text-fg truncate text-sm font-medium">{entry.title}</p>
              <p className="text-fg-subtle mt-0.5 text-xs">
                {entry.organization ? `${entry.organization} · ` : ""}
                {entry.reason ? `${entry.reason} · ` : ""}
                {formatDateTime(entry.expires_at)}까지 차단
              </p>
            </div>
            <button
              type="button"
              onClick={() => unhide.mutate(entry.id)}
              disabled={unhide.isPending}
              className="border-line-strong bg-surface text-fg-muted hover:bg-surface-2 hover:text-fg disabled:bg-surface-3 disabled:text-fg-faint inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md border px-3 text-xs font-medium disabled:cursor-not-allowed disabled:border-transparent"
            >
              {unhide.isPending && unhide.variables === entry.id ? (
                <Loader2 size={16} aria-hidden className="animate-spin" />
              ) : (
                <Undo2 size={16} aria-hidden />
              )}
              숨김 해제
            </button>
          </li>
        ))}
        {data?.length === 0 && (
          <li className="text-fg-subtle px-4 py-10 text-center text-sm">숨긴 공고가 없습니다.</li>
        )}
      </ul>
      <p className="text-fg-subtle text-xs">숨김을 해제하면 다음 수집 때 다시 목록에 포함됩니다.</p>
    </section>
  );
}
