import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProgramDetailBody } from "@/components/ProgramDetailBody";
import { loadProgram, loadProgramDetail } from "@/lib/loadProgram";

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  try {
    const program = await loadProgram(id);
    return {
      title: program.title,
      description: program.summary?.slice(0, 150),
    };
  } catch {
    return { title: "공고" };
  }
}

export default async function ProgramDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const { program, categoryLabels } = await loadProgramDetail(id);

  return (
    <article className="mx-auto max-w-4xl space-y-6">
      <Link
        href="/"
        className="text-fg-muted hover:text-fg inline-flex items-center gap-1.5 text-sm"
      >
        <ArrowLeft size={16} aria-hidden />
        목록으로
      </Link>

      <ProgramDetailBody program={program} categoryLabels={categoryLabels} />
    </article>
  );
}
