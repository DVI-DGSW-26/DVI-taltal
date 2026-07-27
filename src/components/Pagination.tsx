"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useProgramQueryState } from "@/lib/hooks";

const WINDOW = 10;

function windowPages(current: number, total: number): number[] {
  const span = Math.min(WINDOW, total);
  let start = Math.max(1, current - Math.floor(span / 2));
  const end = Math.min(total, start + span - 1);
  start = Math.max(1, end - span + 1);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export function Pagination({ page, pages, total }: { page: number; pages: number; total: number }) {
  const { patch } = useProgramQueryState();
  const [optimisticPage, setOptimisticPage] = useState<number | null>(null);

  if (optimisticPage !== null && optimisticPage === page) {
    setOptimisticPage(null);
  }
  const activePage = optimisticPage ?? page;

  if (pages <= 1) return null;

  const go = (p: number) => {
    if (p < 1 || p > pages || p === activePage) return;
    setOptimisticPage(p);
    patch({ page: p }, false);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav aria-label="페이지" className="flex flex-wrap items-center justify-center gap-1 pt-2">
      <button
        type="button"
        onClick={() => go(1)}
        disabled={activePage <= 1}
        aria-label="첫 페이지로"
        className="inline-flex h-9 items-center rounded-lg px-2 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        <ChevronsLeft size={18} aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => go(activePage - 1)}
        disabled={activePage <= 1}
        className="inline-flex h-9 items-center gap-0.5 rounded-lg px-2 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        <ChevronLeft size={18} aria-hidden />
        <span className="hidden sm:inline">이전</span>
      </button>

      {windowPages(activePage, pages).map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => go(p)}
          aria-current={p === activePage ? "page" : undefined}
          className={`h-9 min-w-9 rounded-lg px-2 text-sm ${
            p === activePage
              ? "bg-brand-500 font-semibold text-white"
              : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          }`}
        >
          {p}
        </button>
      ))}

      <button
        type="button"
        onClick={() => go(activePage + 1)}
        disabled={activePage >= pages}
        className="inline-flex h-9 items-center gap-0.5 rounded-lg px-2 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        <span className="hidden sm:inline">다음</span>
        <ChevronRight size={18} aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => go(pages)}
        disabled={activePage >= pages}
        aria-label="마지막 페이지로"
        className="inline-flex h-9 items-center rounded-lg px-2 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        <ChevronsRight size={18} aria-hidden />
      </button>

      <span className="ml-2 hidden text-sm text-gray-500 sm:inline">
        총 {total.toLocaleString()}건
      </span>
    </nav>
  );
}
