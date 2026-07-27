"use client";

import { Heart } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clientApi } from "@/lib/api";
import type { Program, ProgramPage } from "@/lib/types";

export function FavoriteButton({
  programId,
  isFavorite,
  size = 22,
  withLabel = false,
}: {
  programId: number;
  isFavorite: boolean;
  size?: number;
  withLabel?: boolean;
}) {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: (next: boolean) => clientApi.setFavorite(programId, next),
    onMutate: async (next: boolean) => {
      await qc.cancelQueries({ queryKey: ["program", programId] });
      await qc.cancelQueries({ queryKey: ["programs"] });
      const prevProgram = qc.getQueryData<Program>(["program", programId]);
      const prevLists = qc.getQueriesData<ProgramPage>({ queryKey: ["programs"] });
      if (prevProgram) {
        qc.setQueryData<Program>(["program", programId], { ...prevProgram, is_favorite: next });
      }
      qc.setQueriesData<ProgramPage>({ queryKey: ["programs"] }, (old) =>
        old
          ? {
              ...old,
              items: old.items.map((it) =>
                it.id === programId ? { ...it, is_favorite: next } : it,
              ),
            }
          : old,
      );
      return { prevProgram, prevLists };
    },
    onError: (_err, _next, ctx) => {
      if (ctx?.prevProgram) qc.setQueryData(["program", programId], ctx.prevProgram);
      ctx?.prevLists?.forEach(([key, data]) => qc.setQueryData(key, data));
    },
    onSettled: () => {
      void qc.invalidateQueries({ queryKey: ["program", programId] });
      void qc.invalidateQueries({ queryKey: ["programs"] });
    },
  });

  const optimistic = mutation.isPending ? (mutation.variables as boolean) : isFavorite;

  return (
    <button
      type="button"
      aria-pressed={optimistic}
      aria-label={optimistic ? "관심 해제" : "관심 등록"}
      title={optimistic ? "관심 해제" : "관심 등록"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        mutation.mutate(!optimistic);
      }}
      className="inline-flex items-center gap-1.5 rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-red-500 disabled:opacity-50 dark:hover:bg-gray-800"
      disabled={mutation.isPending}
    >
      <Heart size={size} className={optimistic ? "fill-red-500 text-red-500" : ""} aria-hidden />
      {withLabel && (
        <span className="text-sm whitespace-nowrap">{optimistic ? "관심해제" : "관심등록"}</span>
      )}
    </button>
  );
}
