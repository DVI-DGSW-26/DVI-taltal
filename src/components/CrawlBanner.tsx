"use client";

import { Loader2 } from "lucide-react";
import { useCrawlStatus } from "@/lib/hooks";

export function CrawlBanner() {
  const { data } = useCrawlStatus();
  if (!data?.running) return null;

  return (
    <div
      role="status"
      className="border-info-line bg-info-soft text-info-fg flex items-center gap-2 rounded-xl border px-4 py-3 text-sm"
    >
      <Loader2 size={16} aria-hidden className="animate-spin" />
      <span>
        지원사업을 수집하는 중입니다. 잠시 후 목록이 갱신됩니다.
        {typeof data.database_count === "number" && (
          <span className="ml-1 tabular-nums">(현재 {data.database_count.toLocaleString()}건)</span>
        )}
      </span>
    </div>
  );
}
