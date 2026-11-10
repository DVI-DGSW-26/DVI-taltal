"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Check,
  GripVertical,
  Loader2,
  Pencil,
  Plus,
  RefreshCcw,
  Tags,
  Trash2,
  X,
} from "lucide-react";
import { adminApi } from "@/lib/admin";
import { errorMessage } from "@/lib/api";
import { useCategories } from "@/lib/hooks";
import type { Category } from "@/lib/types";

const createSchema = z.object({
  label: z.string().min(1, "이름을 입력하세요").max(100),
  keywords: z.string().optional(),
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
    defaultValues: { label: "", keywords: "" },
  });

  const mutation = useMutation({
    mutationFn: (values: CreateForm) =>
      adminApi.createCategory({
        label: values.label,
        keywords: splitKeywords(values.keywords),
        sort_order: 100,
      }),
    onSuccess: () => {
      invalidate();
      reset({ label: "", keywords: "" });
    },
  });

  return (
    <form
      onSubmit={handleSubmit((v) => mutation.mutate(v))}
      className="border-edge space-y-4 rounded-xl border p-5"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-fg-muted text-xs font-medium">이름</span>
          <input
            {...register("label")}
            placeholder="수출"
            className="border-line-strong bg-surface text-fg placeholder:text-fg-subtle hover:border-fg-subtle h-10 w-full rounded-md border px-3 text-sm"
          />
          {errors.label && <span className="text-danger-fg text-xs">{errors.label.message}</span>}
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-fg-muted text-xs font-medium">키워드 (쉼표로 구분)</span>
          <input
            {...register("keywords")}
            placeholder="수출, 해외진출, 무역"
            className="border-line-strong bg-surface text-fg placeholder:text-fg-subtle hover:border-fg-subtle h-10 w-full rounded-md border px-3 text-sm"
          />
        </label>
      </div>
      {mutation.isError && <p className="text-danger-fg text-sm">{errorMessage(mutation.error)}</p>}
      <button
        type="submit"
        disabled={mutation.isPending}
        className="bg-brand hover:bg-brand-hover text-on-brand disabled:bg-surface-3 disabled:text-fg-faint inline-flex h-10 items-center gap-1.5 rounded-md px-4 text-sm font-semibold disabled:cursor-not-allowed"
      >
        {mutation.isPending ? (
          <Loader2 size={18} aria-hidden className="animate-spin" />
        ) : (
          <Plus size={18} aria-hidden />
        )}
        카테고리 추가
      </button>
    </form>
  );
}

function CategoryRow({ category, dragging }: { category: Category; dragging?: boolean }) {
  const invalidate = useInvalidateCategories();
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState(category.label);
  const [keywords, setKeywords] = useState(category.keywords.join(", "));
  const isEtc = category.code === "ETC";

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: category.code,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const update = useMutation({
    mutationFn: () =>
      adminApi.updateCategory(category.code, {
        label,
        keywords: splitKeywords(keywords),
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
      <li ref={setNodeRef} style={style} className="space-y-2 px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="border-line-strong bg-surface text-fg placeholder:text-fg-subtle hover:border-fg-subtle h-10 rounded-md border px-3 text-sm"
          />
        </div>
        <input
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="키워드 (쉼표 구분)"
          className="border-line-strong bg-surface text-fg placeholder:text-fg-subtle hover:border-fg-subtle h-10 w-full rounded-md border px-3 text-sm"
        />
        {update.isError && <p className="text-danger-fg text-xs">{errorMessage(update.error)}</p>}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => update.mutate()}
            disabled={update.isPending}
            className="bg-brand hover:bg-brand-hover text-on-brand disabled:bg-surface-3 disabled:text-fg-faint inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-xs font-medium disabled:cursor-not-allowed"
          >
            <Check size={16} aria-hidden />
            저장
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="text-fg-muted hover:bg-surface-2 hover:text-fg inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-xs font-medium"
          >
            <X size={16} aria-hidden />
            취소
          </button>
        </div>
      </li>
    );
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`bg-surface flex items-center justify-between gap-3 px-4 py-3 ${dragging ? "shadow-lg" : ""}`}
    >
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label="순서 변경(드래그)"
          className="text-fg-faint hover:bg-surface-2 hover:text-fg-muted cursor-grab touch-none rounded-md p-1 active:cursor-grabbing"
        >
          <GripVertical size={16} aria-hidden />
        </button>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-fg text-sm font-medium">{category.label}</span>
            {!category.is_active && (
              <span className="border-line bg-surface-2 text-fg-muted inline-flex h-6 items-center rounded-full border px-2 text-xs font-medium">
                비활성
              </span>
            )}
          </div>
          {category.keywords.length > 0 && (
            <p className="text-fg-subtle mt-0.5 truncate text-xs">{category.keywords.join(", ")}</p>
          )}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={() => toggleActive.mutate(!category.is_active)}
          className="text-fg-muted hover:bg-surface-2 hover:text-fg inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-xs font-medium"
        >
          {category.is_active ? "사용중" : "미사용"}
        </button>
        <button
          type="button"
          onClick={() => setEditing(true)}
          aria-label="수정"
          className="text-fg-muted hover:bg-surface-2 hover:text-fg inline-flex h-9 w-9 items-center justify-center rounded-md"
        >
          <Pencil size={16} aria-hidden />
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
            className="text-fg-muted hover:bg-danger-soft hover:text-danger-fg inline-flex h-9 w-9 items-center justify-center rounded-md"
          >
            <Trash2 size={16} aria-hidden />
          </button>
        )}
      </div>
    </li>
  );
}

function CategoryList({ categories }: { categories: Category[] }) {
  const qc = useQueryClient();
  const [order, setOrder] = useState(categories.map((c) => c.code));
  const [lastSeen, setLastSeen] = useState(categories.map((c) => c.code).join(","));
  const [activeId, setActiveId] = useState<string | null>(null);

  const nowKey = categories.map((c) => c.code).join(",");
  if (nowKey !== lastSeen) {
    setLastSeen(nowKey);
    setOrder(categories.map((c) => c.code));
  }

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const persistOrder = useMutation({
    mutationFn: async (newOrder: string[]) => {
      await Promise.all(
        newOrder.map((code, i) => adminApi.updateCategory(code, { sort_order: (i + 1) * 10 })),
      );
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const byCode = new Map(categories.map((c) => [c.code, c]));
  const ordered = order.map((code) => byCode.get(code)).filter((c): c is Category => !!c);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={(e) => setActiveId(String(e.active.id))}
      onDragEnd={(e: DragEndEvent) => {
        setActiveId(null);
        const { active, over } = e;
        if (!over || active.id === over.id) return;
        const oldIndex = order.indexOf(String(active.id));
        const newIndex = order.indexOf(String(over.id));
        const next = arrayMove(order, oldIndex, newIndex);
        setOrder(next);
        persistOrder.mutate(next);
      }}
      onDragCancel={() => setActiveId(null)}
    >
      <SortableContext items={order} strategy={verticalListSortingStrategy}>
        <ul className="divide-line border-edge divide-y overflow-hidden rounded-xl border">
          {ordered.map((c) => (
            <CategoryRow key={c.code} category={c} dragging={activeId === c.code} />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
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
    <section className="border-edge bg-surface space-y-4 rounded-xl border p-5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-fg flex items-center gap-2 text-base font-semibold">
          <Tags size={20} aria-hidden className="text-fg-subtle" />
          카테고리 관리
        </h2>
        <button
          type="button"
          onClick={() => reclassify.mutate()}
          disabled={reclassify.isPending}
          title="추가/수정한 카테고리를 기존 공고에도 반영"
          className="border-line-strong bg-surface text-fg-muted hover:bg-surface-2 hover:text-fg disabled:bg-surface-3 disabled:text-fg-faint inline-flex h-10 items-center gap-1.5 rounded-md border px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:border-transparent"
        >
          {reclassify.isPending ? (
            <Loader2 size={16} aria-hidden className="animate-spin" />
          ) : (
            <RefreshCcw size={16} aria-hidden />
          )}
          전체 재분류
        </button>
      </div>

      {reclassify.isSuccess && (
        <p className="text-success-fg text-sm">
          {reclassify.data.reclassified}건을 재분류했습니다.
        </p>
      )}
      {reclassify.isError && (
        <p className="text-danger-fg text-sm">{errorMessage(reclassify.error)}</p>
      )}

      <AddCategoryForm />

      {isLoading && (
        <div className="border-edge text-fg-subtle rounded-xl border px-4 py-10 text-center text-sm">
          불러오는 중…
        </div>
      )}
      {categories && categories.length > 0 && <CategoryList categories={categories} />}
      {categories?.length === 0 && (
        <div className="border-edge text-fg-subtle rounded-xl border px-4 py-10 text-center text-sm">
          카테고리가 없습니다.
        </div>
      )}
    </section>
  );
}
