"use client";

import { Globe } from "lucide-react";
import { useSources } from "@/lib/hooks";
import { sourceMethodLabel } from "@/lib/labels";
import { formatDateTime } from "@/lib/format";

export function SourcesPanel() {
  const { data: sources, isLoading } = useSources();

  return (
    <section className="border-edge bg-surface space-y-4 rounded-xl border p-5">
      <h2 className="text-fg flex items-center gap-2 text-base font-semibold">
        <Globe size={20} aria-hidden className="text-fg-subtle" />
        수집 대상 사이트
      </h2>

      {isLoading && (
        <div className="border-edge text-fg-subtle rounded-xl border px-4 py-10 text-center text-sm">
          불러오는 중…
        </div>
      )}

      {sources && sources.length > 0 && (
        <ul className="divide-line border-edge divide-y overflow-hidden rounded-xl border">
          {sources.map((s) => (
            <li key={s.name} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="text-fg truncate text-sm font-medium">{s.name}</p>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-fg text-fg-muted block truncate text-xs"
                >
                  {s.url}
                </a>
                <p className="text-fg-subtle mt-0.5 text-xs">
                  {sourceMethodLabel(s.method)} · 마지막 수집{" "}
                  {formatDateTime(s.last_crawled_at) || "—"}
                </p>
              </div>
              <span className="text-fg-muted shrink-0 text-sm font-semibold tabular-nums">
                {s.program_count.toLocaleString()}건
              </span>
            </li>
          ))}
        </ul>
      )}

      {sources?.length === 0 && (
        <div className="border-edge text-fg-subtle rounded-xl border px-4 py-10 text-center text-sm">
          등록된 수집 대상이 없습니다.
        </div>
      )}
    </section>
  );
}
