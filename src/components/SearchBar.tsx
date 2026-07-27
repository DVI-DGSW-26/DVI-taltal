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
          className="absolute top-1/2 left-2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <Search size={20} aria-hidden />
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
          className="w-full rounded-lg border border-gray-300 bg-white py-2 pr-10 pl-11 text-sm outline-none dark:border-gray-700 dark:bg-gray-900"
        />
        {text && (
          <button
            type="button"
            onClick={() => {
              setText("");
              runSearch("");
            }}
            aria-label="검색어 지우기"
            className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X size={18} aria-hidden />
          </button>
        )}
      </div>

      <button
        type="button"
        aria-pressed={query.similar}
        onClick={() => patch({ similar: !query.similar })}
        title="입력어의 동의어·연관어까지 확장 검색"
        className={`inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
          query.similar
            ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-700/20 dark:text-brand-100"
            : "border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        }`}
      >
        <Sparkles size={18} aria-hidden />
        유사어 포함
      </button>
    </form>
  );
}
