"use client";

import { useSyncExternalStore } from "react";
import { ArrowUp } from "lucide-react";

function subscribe(cb: () => void): () => void {
  window.addEventListener("scroll", cb, { passive: true });
  return () => window.removeEventListener("scroll", cb);
}

function getSnapshot(): boolean {
  return window.scrollY > 300;
}

export function ScrollTopButton() {
  const visible = useSyncExternalStore(subscribe, getSnapshot, () => false);
  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="맨 위로"
      title="맨 위로"
      className="hover:text-brand-600 inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-lg transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
    >
      <ArrowUp size={20} aria-hidden />
    </button>
  );
}
