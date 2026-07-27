"use client";

import { useQuery } from "@tanstack/react-query";
import { FavoriteButton } from "@/components/FavoriteButton";
import { clientApi } from "@/lib/api";
import { queryKeys } from "@/lib/query";
import type { Program } from "@/lib/types";

export function DetailFavorite({ program }: { program: Program }) {
  const { data } = useQuery({
    queryKey: queryKeys.program(program.id),
    queryFn: () => clientApi.program(program.id),
    initialData: program,
    staleTime: 0,
    refetchOnMount: "always",
  });
  const p = data ?? program;
  return <FavoriteButton programId={p.id} isFavorite={p.is_favorite} withLabel />;
}
