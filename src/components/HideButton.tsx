"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EyeOff, Loader2 } from "lucide-react";
import { adminApi } from "@/lib/admin";
import { errorMessage } from "@/lib/api";

export function HideButton({ programId, onHidden }: { programId: number; onHidden?: () => void }) {
  const [confirming, setConfirming] = useState(false);
  const [reason, setReason] = useState("");
  const router = useRouter();
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => adminApi.hideProgram(programId, reason.trim() || undefined),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["programs"] });
      void qc.invalidateQueries({ queryKey: ["blacklist"] });
      if (onHidden) {
        onHidden();
      } else {
        router.replace("/");
      }
    },
  });

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="border-line-strong bg-surface text-fg-muted hover:bg-surface-2 hover:text-fg inline-flex h-10 items-center gap-1.5 rounded-md border px-4 text-sm font-semibold"
      >
        <EyeOff size={18} aria-hidden />이 공고 숨기기
      </button>
    );
  }

  return (
    <div className="border-warn-line bg-warn-soft space-y-3 rounded-xl border p-4">
      <p className="text-warn-fg text-sm">
        숨기면 목록에서 삭제되고 일정 기간 재수집되지 않습니다. 진행할까요?
      </p>
      <input
        type="text"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="사유(선택)"
        className="border-line-strong bg-surface text-fg placeholder:text-fg-subtle hover:border-fg-subtle h-10 w-full rounded-md border px-3 text-sm"
      />
      {mutation.isError && <p className="text-danger-fg text-sm">{errorMessage(mutation.error)}</p>}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          className="bg-danger hover:bg-danger-hover disabled:bg-surface-3 disabled:text-fg-faint inline-flex h-10 items-center gap-1.5 rounded-md px-4 text-sm font-semibold text-white disabled:cursor-not-allowed"
        >
          {mutation.isPending && <Loader2 size={16} aria-hidden className="animate-spin" />}
          숨기기
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          disabled={mutation.isPending}
          className="border-line-strong bg-surface text-fg-muted hover:bg-surface-2 hover:text-fg inline-flex h-10 items-center gap-1.5 rounded-md border px-4 text-sm font-semibold"
        >
          취소
        </button>
      </div>
    </div>
  );
}
