"use client";

import { Globe } from "lucide-react";
import { useSources } from "@/lib/hooks";
import { sourceMethodLabel } from "@/lib/labels";
import { formatDateTime } from "@/lib/format";

export function SourcesPanel() {
  const { data: sources, isLoading } = useSources();

  return (
    <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
      <h2 className="flex items-center gap-2 text-base font-semibold">
        <Globe size={18} aria-hidden className="text-gray-400" />
        수집 대상 사이트
      </h2>

      {isLoading && (
        <div className="rounded-lg border border-gray-200 px-4 py-6 text-center text-sm text-gray-400 dark:border-gray-800">
          불러오는 중…
        </div>
      )}

      {sources && sources.length > 0 && (
        <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200 dark:divide-gray-800 dark:border-gray-800">
          {sources.map((s) => (
            <li key={s.name} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-600 truncate text-sm font-medium"
                >
                  {s.name}
                </a>
                <p className="mt-0.5 text-xs text-gray-400">
                  {sourceMethodLabel(s.method)} · 마지막 수집 {formatDateTime(s.last_crawled_at) || "—"}
                </p>
              </div>
              <span className="shrink-0 text-sm font-semibold text-gray-700 dark:text-gray-200">
                {s.program_count.toLocaleString()}건
              </span>
            </li>
          ))}
        </ul>
      )}

      {sources?.length === 0 && (
        <div className="rounded-lg border border-gray-200 px-4 py-6 text-center text-sm text-gray-400 dark:border-gray-800">
          등록된 수집 대상이 없습니다.
        </div>
      )}
    </section>
  );
}
