"use client";

import { Loader2 } from "lucide-react";
import { useCrawlStatus } from "@/lib/hooks";

export function CrawlBanner() {
  const { data } = useCrawlStatus();
  if (!data?.running) return null;

  return (
    <div
      role="status"
      className="border-brand-200 bg-brand-50 text-brand-700 dark:border-brand-700/40 dark:bg-brand-700/15 dark:text-brand-100 flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm"
    >
      <Loader2 size={16} aria-hidden className="animate-spin" />
      <span>
        지원사업을 수집하는 중입니다. 잠시 후 목록이 갱신됩니다.
        {typeof data.database_count === "number" && (
          <span className="text-brand-600/80 dark:text-brand-200/80 ml-1">
            (현재 {data.database_count.toLocaleString()}건)
          </span>
        )}
      </span>
    </div>
  );
}
