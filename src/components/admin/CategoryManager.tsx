"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Loader2, Pencil, Plus, RefreshCcw, Tags, Trash2, X } from "lucide-react";
import { adminApi } from "@/lib/admin";
import { errorMessage } from "@/lib/api";
import { useCategories } from "@/lib/hooks";
import type { Category } from "@/lib/types";

const createSchema = z.object({
  code: z.string().regex(/^[A-Z0-9_]{2,50}$/, "영문 대문자·숫자·밑줄 2~50자"),
  label: z.string().min(1, "라벨을 입력하세요").max(100),
  keywords: z.string().optional(),
  sort_order: z.string().optional(),
});

type CreateForm = z.input<typeof createSchema>;

function splitKeywords(raw: string | undefined): string[] {
  return (raw ?? "")
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function useInvalidateCategories() {
  const qc = useQueryClient();
  return () => {
    void qc.invalidateQueries({ queryKey: ["categories"] });
  };
}

function AddCategoryForm() {
  const invalidate = useInvalidateCategories();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateForm>({
    resolver: zodResolver(createSchema),
    defaultValues: { code: "", label: "", keywords: "", sort_order: "100" },
  });

  const mutation = useMutation({
    mutationFn: (values: CreateForm) =>
      adminApi.createCategory({
        code: values.code,
        label: values.label,
        keywords: splitKeywords(values.keywords),
        sort_order: values.sort_order ? Number(values.sort_order) : 100,
      }),
    onSuccess: () => {
      invalidate();
      reset({ code: "", label: "", keywords: "", sort_order: "100" });
    },
  });

  return (
    <form
      onSubmit={handleSubmit((v) => mutation.mutate(v))}
      className="space-y-3 rounded-lg border border-gray-200 p-4 dark:border-gray-800"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span className="font-medium text-gray-600 dark:text-gray-300">코드</span>
          <input
            {...register("code")}
            placeholder="EXPORT"
            className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 uppercase dark:border-gray-700 dark:bg-gray-900"
          />
          {errors.code && <span className="text-xs text-red-600">{errors.code.message}</span>}
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-medium text-gray-600 dark:text-gray-300">라벨</span>
          <input
            {...register("label")}
            placeholder="수출"
            className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 dark:border-gray-700 dark:bg-gray-900"
          />
          {errors.label && <span className="text-xs text-red-600">{errors.label.message}</span>}
        </label>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_120px]">
        <label className="space-y-1 text-sm">
          <span className="font-medium text-gray-600 dark:text-gray-300">키워드 (쉼표로 구분)</span>
          <input
            {...register("keywords")}
            placeholder="수출, 해외진출, 무역"
            className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 dark:border-gray-700 dark:bg-gray-900"
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-medium text-gray-600 dark:text-gray-300">정렬순서</span>
          <input
            type="number"
            {...register("sort_order")}
            className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 dark:border-gray-700 dark:bg-gray-900"
          />
        </label>
      </div>
      {mutation.isError && <p className="text-sm text-red-600">{errorMessage(mutation.error)}</p>}
      <button
        type="submit"
        disabled={mutation.isPending}
        className="bg-brand-500 hover:bg-brand-600 inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {mutation.isPending ? (
          <Loader2 size={16} aria-hidden className="animate-spin" />
        ) : (
          <Plus size={16} aria-hidden />
        )}
        카테고리 추가
      </button>
    </form>
  );
}

function CategoryRow({ category }: { category: Category }) {
  const invalidate = useInvalidateCategories();
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState(category.label);
  const [keywords, setKeywords] = useState(category.keywords.join(", "));
  const [sortOrder, setSortOrder] = useState(String(category.sort_order));
  const isEtc = category.code === "ETC";

  const update = useMutation({
    mutationFn: () =>
      adminApi.updateCategory(category.code, {
        label,
        keywords: splitKeywords(keywords),
        sort_order: Number(sortOrder),
      }),
    onSuccess: () => {
      invalidate();
      setEditing(false);
    },
  });

  const toggleActive = useMutation({
    mutationFn: (next: boolean) => adminApi.updateCategory(category.code, { is_active: next }),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: () => adminApi.deleteCategory(category.code),
    onSuccess: invalidate,
  });

  if (editing) {
    return (
      <li className="space-y-2 px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-gray-800">
            {category.code}
          </code>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="rounded-md border border-gray-300 px-2 py-1 text-sm dark:border-gray-700 dark:bg-gray-900"
          />
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-20 rounded-md border border-gray-300 px-2 py-1 text-sm dark:border-gray-700 dark:bg-gray-900"
          />
        </div>
        <input
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="키워드 (쉼표 구분)"
          className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm dark:border-gray-700 dark:bg-gray-900"
        />
        {update.isError && <p className="text-xs text-red-600">{errorMessage(update.error)}</p>}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => update.mutate()}
            disabled={update.isPending}
            className="bg-brand-500 hover:bg-brand-600 inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium text-white"
          >
            <Check size={13} aria-hidden />
            저장
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X size={13} aria-hidden />
            취소
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className="flex items-center justify-between gap-3 px-4 py-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-gray-800">
            {category.code}
          </code>
          <span className="font-medium">{category.label}</span>
          {!category.is_active && (
            <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500 dark:bg-gray-800">
              비활성
            </span>
          )}
          <span className="text-xs text-gray-400">#{category.sort_order}</span>
        </div>
        {category.keywords.length > 0 && (
          <p className="mt-0.5 truncate text-xs text-gray-400">{category.keywords.join(", ")}</p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={() => toggleActive.mutate(!category.is_active)}
          className="rounded-md px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {category.is_active ? "비활성화" : "활성화"}
        </button>
        <button
          type="button"
          onClick={() => setEditing(true)}
          aria-label="수정"
          className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Pencil size={15} aria-hidden />
        </button>
        {!isEtc && (
          <button
            type="button"
            onClick={() => {
              if (
                confirm(`'${category.label}' 카테고리를 삭제할까요? 공고의 해당 분류도 제거됩니다.`)
              )
                remove.mutate();
            }}
            aria-label="삭제"
            className="rounded-md p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
          >
            <Trash2 size={15} aria-hidden />
          </button>
        )}
      </div>
    </li>
  );
}

export function CategoryManager() {
  const { data: categories, isLoading } = useCategories(true);
  const qc = useQueryClient();

  const reclassify = useMutation({
    mutationFn: () => adminApi.reclassify(),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["programs"] });
    },
  });

  return (
    <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-base font-semibold">
          <Tags size={18} aria-hidden className="text-gray-400" />
          카테고리 관리
        </h2>
        <button
          type="button"
          onClick={() => reclassify.mutate()}
          disabled={reclassify.isPending}
          title="추가/수정한 카테고리를 기존 공고에도 반영"
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-60 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          {reclassify.isPending ? (
            <Loader2 size={15} aria-hidden className="animate-spin" />
          ) : (
            <RefreshCcw size={15} aria-hidden />
          )}
          전체 재분류
        </button>
      </div>

      {reclassify.isSuccess && (
        <p className="text-sm text-green-600">{reclassify.data.reclassified}건을 재분류했습니다.</p>
      )}
      {reclassify.isError && (
        <p className="text-sm text-red-600">{errorMessage(reclassify.error)}</p>
      )}

      <AddCategoryForm />

      <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200 dark:divide-gray-800 dark:border-gray-800">
        {isLoading && <li className="px-4 py-6 text-center text-sm text-gray-400">불러오는 중…</li>}
        {categories?.map((c) => <CategoryRow key={c.code} category={c} />)}
        {categories?.length === 0 && (
          <li className="px-4 py-6 text-center text-sm text-gray-400">카테고리가 없습니다.</li>
        )}
      </ul>
    </section>
  );
}
