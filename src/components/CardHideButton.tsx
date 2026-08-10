"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, EyeOff, Loader2, X } from "lucide-react";
import { adminApi } from "@/lib/admin";

export function CardHideButton({ programId, size = 20 }: { programId: number; size?: number }) {
  const [confirming, setConfirming] = useState(false);
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => adminApi.hideProgram(programId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["programs"] });
      void qc.invalidateQueries({ queryKey: ["blacklist"] });
    },
  });

  if (confirming) {
    return (
      <div
        role="group"
        onClick={(e) => e.preventDefault()}
        className="relative z-10 inline-flex items-center gap-0.5 rounded-md border border-amber-300 bg-amber-50 p-0.5 dark:border-amber-700/50 dark:bg-amber-950/40"
      >
        <button
          type="button"
          aria-label="숨기기 확정"
          title="숨기기 확정"
          disabled={mutation.isPending}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            mutation.mutate();
          }}
          className="inline-flex items-center rounded p-1 text-red-600 hover:bg-red-100 disabled:opacity-50 dark:hover:bg-red-950/40"
        >
          {mutation.isPending ? (
            <Loader2 size={14} aria-hidden className="animate-spin" />
          ) : (
            <Check size={14} aria-hidden />
          )}
        </button>
        <button
          type="button"
          aria-label="취소"
          title="취소"
          disabled={mutation.isPending}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setConfirming(false);
          }}
          className="inline-flex items-center rounded p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X size={14} aria-hidden />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      aria-label="이 공고 숨기기"
      title="이 공고 숨기기"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setConfirming(true);
      }}
      className="relative z-10 inline-flex items-center gap-1.5 rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800"
    >
      <EyeOff size={size} aria-hidden />
    </button>
  );
}
