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
      className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="absolute top-4 right-4 z-10 rounded-lg bg-white p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:bg-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-300"
        >
          <X size={20} aria-hidden />
        </button>
        <div className="overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}
