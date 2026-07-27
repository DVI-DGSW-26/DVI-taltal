import type { Metadata } from "next";
import { DetailModal } from "@/components/DetailModal";
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

export default async function ProgramDetailModalPage({ params }: { params: Params }) {
  const { id } = await params;
  const { program, categoryLabels } = await loadProgramDetail(id);

  return (
    <DetailModal>
      <ProgramDetailBody program={program} categoryLabels={categoryLabels} />
    </DetailModal>
  );
}
