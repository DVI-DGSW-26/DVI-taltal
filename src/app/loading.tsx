import { ProgramListSkeleton } from "@/components/Skeletons";

export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="bg-surface-3 h-11 animate-pulse rounded-lg" />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[280px_1fr]">
        <div className="bg-surface-3 h-96 animate-pulse rounded-xl" />
        <ProgramListSkeleton />
      </div>
    </div>
  );
}
