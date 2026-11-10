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
        className="text-fg-muted hover:bg-surface-2 hover:text-fg disabled:text-fg-faint inline-flex h-9 items-center rounded-md px-2 text-sm disabled:cursor-not-allowed disabled:hover:bg-transparent"
      >
        <ChevronsLeft size={16} aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => go(activePage - 1)}
        disabled={activePage <= 1}
        className="text-fg-muted hover:bg-surface-2 hover:text-fg disabled:text-fg-faint inline-flex h-9 items-center gap-1 rounded-md px-3 text-sm font-medium disabled:cursor-not-allowed disabled:hover:bg-transparent"
      >
        <ChevronLeft size={16} aria-hidden />
        <span className="hidden sm:inline">이전</span>
      </button>

      {windowPages(activePage, pages).map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => go(p)}
          aria-current={p === activePage ? "page" : undefined}
          className={`h-9 min-w-9 rounded-md px-2 text-sm tabular-nums ${
            p === activePage
              ? "bg-brand-soft text-brand-fg font-semibold"
              : "text-fg-muted hover:bg-surface-2 hover:text-fg"
          }`}
        >
          {p}
        </button>
      ))}

      <button
        type="button"
        onClick={() => go(activePage + 1)}
        disabled={activePage >= pages}
        className="text-fg-muted hover:bg-surface-2 hover:text-fg disabled:text-fg-faint inline-flex h-9 items-center gap-1 rounded-md px-3 text-sm font-medium disabled:cursor-not-allowed disabled:hover:bg-transparent"
      >
        <span className="hidden sm:inline">다음</span>
        <ChevronRight size={16} aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => go(pages)}
        disabled={activePage >= pages}
        aria-label="마지막 페이지로"
        className="text-fg-muted hover:bg-surface-2 hover:text-fg disabled:text-fg-faint inline-flex h-9 items-center rounded-md px-2 text-sm disabled:cursor-not-allowed disabled:hover:bg-transparent"
      >
        <ChevronsRight size={16} aria-hidden />
      </button>

      <span className="text-fg-muted ml-2 hidden text-sm tabular-nums sm:inline">
        총 {total.toLocaleString()}건
      </span>
    </nav>
  );
}
