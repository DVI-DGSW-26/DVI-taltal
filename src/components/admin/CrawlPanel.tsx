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
    <section className="border-edge bg-surface space-y-4 rounded-xl border p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-fg flex items-center gap-2 text-base font-semibold">
          <Database size={20} aria-hidden className="text-fg-subtle" />
          수집 상태
        </h2>
        <span
          className={`inline-flex h-6 items-center gap-1.5 rounded-full border px-2 text-xs font-medium ${
            running
              ? "border-info-line bg-info-soft text-info-fg"
              : "border-success-line bg-success-soft text-success-fg"
          }`}
        >
          {running && <Loader2 size={16} aria-hidden className="animate-spin" />}
          {running ? "수집 중" : "수집 완료"}
        </span>
      </div>

      <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
        <div>
          <dt className="text-fg-muted text-xs">저장된 공고</dt>
          <dd className="text-xl font-semibold tabular-nums">
            {status?.database_count?.toLocaleString() ?? "—"}
          </dd>
        </div>
        <div>
          <dt className="text-fg-muted text-xs">시작</dt>
          <dd>{formatDateTime(status?.started_at) || "—"}</dd>
        </div>
        <div>
          <dt className="text-fg-muted text-xs">종료</dt>
          <dd>{formatDateTime(status?.finished_at) || "—"}</dd>
        </div>
        <div>
          <dt className="text-fg-muted text-xs">최근 수집</dt>
          <dd>{last ? `${last.collected}건` : "—"}</dd>
        </div>
      </dl>

      {last && (
        <p className="text-fg-subtle text-xs">
          수집 {last.collected} · 삭제 {last.deleted} · 첨부재시도 {last.retried_attachments} ·
          마감제외 {last.skipped_closed} · 블랙리스트차단 {last.blocked_by_blacklist}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => trigger.mutate()}
          disabled={trigger.isPending || running}
          className="bg-brand hover:bg-brand-hover text-on-brand disabled:bg-surface-3 disabled:text-fg-faint inline-flex h-10 items-center gap-1.5 rounded-md px-4 text-sm font-semibold disabled:cursor-not-allowed"
        >
          {trigger.isPending ? (
            <Loader2 size={18} aria-hidden className="animate-spin" />
          ) : (
            <RefreshCw size={18} aria-hidden />
          )}
          수동 수집 실행
        </button>
        {trigger.isError && (
          <span className="text-danger-fg text-sm">{errorMessage(trigger.error)}</span>
        )}
        {trigger.isSuccess && (
          <span className="text-success-fg text-sm">
            {String(trigger.data?.status) === "already_running"
              ? "이미 수집이 진행 중입니다."
              : "수집을 시작했습니다."}
          </span>
        )}
      </div>
    </section>
  );
}
