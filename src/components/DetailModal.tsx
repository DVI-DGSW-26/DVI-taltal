"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

export function DetailModal({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-black/40 p-4 sm:items-center dark:bg-black/60"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="border-edge bg-surface relative flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border shadow-xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="bg-surface text-fg-muted hover:bg-surface-2 hover:text-fg absolute top-4 right-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-lg"
        >
          <X size={20} aria-hidden />
        </button>
        <div className="overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}
