"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Database, Loader2, RefreshCw } from "lucide-react";
import { adminApi } from "@/lib/admin";
import { errorMessage } from "@/lib/api";
import { useCrawlStatus } from "@/lib/hooks";
import { formatDateTime } from "@/lib/format";

export function CrawlPanel() {
  const { data: status } = useCrawlStatus();
  const qc = useQueryClient();

  const trigger = useMutation({
    mutationFn: () => adminApi.triggerCrawl(),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["crawl-status"] });
    },
  });

  const running = status?.running ?? false;
  const last = status?.last_result;

  return (
    <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-semibold">
          <Database size={18} aria-hidden className="text-gray-400" />
          수집 상태
        </h2>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
            running
              ? "bg-brand-100 text-brand-700 dark:bg-brand-700/30 dark:text-brand-100"
              : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
          }`}
        >
          {running && <Loader2 size={12} aria-hidden className="animate-spin" />}
          {running ? "수집 중" : "대기"}
        </span>
      </div>

      <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        <div>
          <dt className="text-gray-400">저장된 공고</dt>
          <dd className="text-lg font-semibold">
            {status?.database_count?.toLocaleString() ?? "—"}
          </dd>
        </div>
        <div>
          <dt className="text-gray-400">시작</dt>
          <dd>{formatDateTime(status?.started_at) || "—"}</dd>
        </div>
        <div>
          <dt className="text-gray-400">종료</dt>
          <dd>{formatDateTime(status?.finished_at) || "—"}</dd>
        </div>
        <div>
          <dt className="text-gray-400">최근 수집</dt>
          <dd>{last ? `${last.collected}건` : "—"}</dd>
        </div>
      </dl>

      {last && (
        <p className="text-xs text-gray-400">
          수집 {last.collected} · 삭제 {last.deleted} · 첨부재시도 {last.retried_attachments} ·
          마감제외 {last.skipped_closed} · 블랙리스트차단 {last.blocked_by_blacklist}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => trigger.mutate()}
          disabled={trigger.isPending || running}
          className="bg-brand-500 hover:bg-brand-600 inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {trigger.isPending ? (
            <Loader2 size={16} aria-hidden className="animate-spin" />
          ) : (
            <RefreshCw size={16} aria-hidden />
          )}
          수동 수집 실행
        </button>
        {trigger.isError && (
          <span className="text-sm text-red-600">{errorMessage(trigger.error)}</span>
        )}
        {trigger.isSuccess && (
          <span className="text-sm text-green-600">
            {String(trigger.data?.status) === "already_running"
              ? "이미 수집이 진행 중입니다."
              : "수집을 시작했습니다."}
          </span>
        )}
      </div>
      <p className="text-xs text-gray-400">
        관리자 키는 서버(Route Handler)에서만 주입됩니다. 키 미설정 시 503이 반환됩니다.
      </p>
    </section>
  );
}
