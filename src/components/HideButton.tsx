"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EyeOff, Loader2 } from "lucide-react";
import { adminApi } from "@/lib/admin";
import { errorMessage } from "@/lib/api";

export function HideButton({
  programId,
  onHidden,
}: {
  programId: number;
  onHidden?: () => void;
}) {
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
        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        <EyeOff size={16} aria-hidden />이 공고 숨기기
      </button>
    );
  }

  return (
    <div className="space-y-2 rounded-lg border border-amber-300 bg-amber-50 p-3 dark:border-amber-700/50 dark:bg-amber-950/20">
      <p className="text-sm text-amber-800 dark:text-amber-200">
        숨기면 목록에서 삭제되고 일정 기간 재수집되지 않습니다. 진행할까요?
      </p>
      <input
        type="text"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="사유(선택)"
        className="w-full rounded-md border border-amber-300 bg-white px-2.5 py-1.5 text-sm dark:border-amber-700/50 dark:bg-gray-900"
      />
      {mutation.isError && <p className="text-sm text-red-600">{errorMessage(mutation.error)}</p>}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          className="inline-flex items-center gap-1.5 rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
        >
          {mutation.isPending && <Loader2 size={14} aria-hidden className="animate-spin" />}
          숨기기
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          disabled={mutation.isPending}
          className="rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          취소
        </button>
      </div>
    </div>
  );
}
