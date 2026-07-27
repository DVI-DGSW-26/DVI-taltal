"use client";

import { useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { SearchX } from "lucide-react";
import { DetailModal } from "@/components/DetailModal";
import { ProgramCard } from "@/components/ProgramCard";
import { ProgramDetailBody } from "@/components/ProgramDetailBody";
import { Pagination } from "@/components/Pagination";
import { ProgramCardSkeleton } from "@/components/Skeletons";
import { clientApi, errorMessage } from "@/lib/api";
import { useCategories, useProgramQueryState } from "@/lib/hooks";
import { categoryLabelMap } from "@/lib/labels";
import { queryKeys } from "@/lib/query";
import { programQueryKey } from "@/lib/url";
import type { Program, ProgramPage } from "@/lib/types";

export function ProgramResults({
  initialPage,
  initialKey,
}: {
  initialPage: ProgramPage;
  initialKey: string;
}) {
  const { query } = useProgramQueryState();
  const key = programQueryKey(query);
  const { data: categories } = useCategories();
  const categoryLabels = useMemo(() => categoryLabelMap(categories), [categories]);
  const [selected, setSelected] = useState<Program | null>(null);

  const { data, isPlaceholderData, isLoading, isError, error } = useQuery({
    queryKey: queryKeys.programs(key),
    queryFn: () => clientApi.programs(query),
    placeholderData: keepPreviousData,
    initialData: key === initialKey ? initialPage : undefined,
  });

  let content: React.ReactNode;

  if (isLoading) {
    content = (
      <ul className="grid grid-cols-1 gap-4 @[440px]:grid-cols-2 @[640px]:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProgramCardSkeleton key={i} />
        ))}
      </ul>
    );
  } else if (isError) {
    content = (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
        목록을 불러오지 못했습니다: {errorMessage(error)}
      </div>
    );
  } else if ((data as ProgramPage).items.length === 0) {
    content = (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-gray-300 py-16 text-center dark:border-gray-700">
        <SearchX size={32} aria-hidden className="text-gray-400" />
        <p className="text-sm text-gray-500">조건에 맞는 지원사업이 없습니다.</p>
      </div>
    );
  } else {
    const page = data as ProgramPage;
    content = (
      <div className="space-y-4">
        <p className="text-sm text-gray-500">
          총 <b className="text-gray-900 dark:text-gray-100">{page.total.toLocaleString()}</b>건
        </p>
        <ul
          className={`grid grid-cols-1 gap-4 transition-opacity @[440px]:grid-cols-2 @[640px]:grid-cols-3 ${
            isPlaceholderData ? "opacity-60" : "opacity-100"
          }`}
        >
          {page.items.map((program) => (
            <ProgramCard
              key={program.id}
              program={program}
              categoryLabels={categoryLabels}
              onOpen={setSelected}
            />
          ))}
        </ul>
        <Pagination page={page.page} pages={page.pages} total={page.total} />
      </div>
    );
  }

  return (
    <>
      {content}
      {selected && (
        <DetailModal onClose={() => setSelected(null)}>
          <ProgramDetailBody
            program={selected}
            categoryLabels={categoryLabels}
            onHidden={() => setSelected(null)}
          />
        </DetailModal>
      )}
    </>
  );
}
