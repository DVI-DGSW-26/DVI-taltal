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
        className="border-warn-line bg-warn-soft relative z-10 inline-flex items-center gap-0.5 rounded-md border p-0.5"
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
          className="text-danger-fg hover:bg-danger-soft disabled:text-fg-faint inline-flex items-center rounded-md p-1 disabled:cursor-not-allowed"
        >
          {mutation.isPending ? (
            <Loader2 size={16} aria-hidden className="animate-spin" />
          ) : (
            <Check size={16} aria-hidden />
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
          className="text-fg-muted hover:bg-surface-2 hover:text-fg inline-flex items-center rounded-md p-1"
        >
          <X size={16} aria-hidden />
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
      className="text-fg-muted hover:bg-surface-2 hover:text-fg relative z-10 inline-flex items-center gap-1.5 rounded-lg p-1.5 transition-colors"
    >
      <EyeOff size={size} aria-hidden />
    </button>
  );
}
