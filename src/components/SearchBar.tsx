"use client";

import { useState } from "react";
import { Search, Sparkles, X } from "lucide-react";
import { useProgramQueryState } from "@/lib/hooks";

export function SearchBar() {
  const { query, patch } = useProgramQueryState();
  const [text, setText] = useState(query.q);
  const [syncedQ, setSyncedQ] = useState(query.q);

  if (syncedQ !== query.q) {
    setSyncedQ(query.q);
    if (text !== query.q) setText(query.q);
  }

  const runSearch = (q: string) => {
    if (q !== query.q) patch({ q });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        runSearch(text);
      }}
      className="mx-auto flex w-full max-w-3xl flex-col gap-2 sm:flex-row sm:items-center"
    >
      <div className="relative flex-1">
        <button
          type="submit"
          aria-label="검색"
          className="text-fg-subtle hover:text-fg absolute top-1/2 left-1.5 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg"
        >
          <Search size={18} aria-hidden />
        </button>
        <input
          type="text"
          inputMode="search"
          name="q"
          value={text}
          maxLength={300}
          onChange={(e) => setText(e.target.value)}
          placeholder="지원사업 검색 (예: 스마트공장, 수출바우처) · Enter로 검색"
          aria-label="지원사업 검색"
          className="border-line-strong bg-surface text-fg placeholder:text-fg-subtle hover:border-fg-subtle h-10 w-full rounded-lg border pr-10 pl-10 text-sm outline-none"
        />
        {text && (
          <button
            type="button"
            onClick={() => {
              setText("");
              runSearch("");
            }}
            aria-label="검색어 지우기"
            className="text-fg-subtle hover:bg-surface-2 hover:text-fg absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1"
          >
            <X size={16} aria-hidden />
          </button>
        )}
      </div>

      <button
        type="button"
        aria-pressed={query.similar}
        onClick={() => patch({ similar: !query.similar })}
        title="입력어의 동의어·연관어까지 확장 검색"
        className={`inline-flex h-10 items-center justify-center gap-1.5 rounded-md border px-4 text-sm font-semibold transition-colors ${
          query.similar
            ? "border-brand bg-brand-soft text-brand-fg"
            : "border-line-strong bg-surface text-fg-muted hover:bg-surface-2 hover:text-fg"
        }`}
      >
        <Sparkles size={18} aria-hidden />
        유사어 포함
      </button>
    </form>
  );
}
