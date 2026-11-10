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
      className="border-edge bg-surface text-fg-muted hover:bg-surface-2 hover:text-fg inline-flex h-10 w-10 items-center justify-center rounded-full border shadow-lg transition-colors"
    >
      <ArrowUp size={20} aria-hidden />
    </button>
  );
}
