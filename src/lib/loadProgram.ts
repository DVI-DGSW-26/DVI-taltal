import { notFound } from "next/navigation";
import { ApiError, serverApi } from "@/lib/api";
import { categoryLabelMap } from "@/lib/labels";
import type { Program } from "@/lib/types";

export async function loadProgram(idRaw: string): Promise<Program> {
  const id = Number(idRaw);
  if (!Number.isInteger(id) || id < 1) notFound();
  try {
    return await serverApi.program(id);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }
}

export async function loadProgramDetail(idRaw: string) {
  const [program, categories] = await Promise.all([
    loadProgram(idRaw),
    serverApi.categories().catch(() => []),
  ]);
  return { program, categoryLabels: categoryLabelMap(categories) };
}
