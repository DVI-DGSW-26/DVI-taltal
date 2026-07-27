import { ProgramListSkeleton } from "@/components/Skeletons";

export default function Loading() {
  return (
    <div className="space-y-5">
      <div className="h-11 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[280px_1fr]">
        <div className="h-96 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
        <ProgramListSkeleton />
      </div>
    </div>
  );
}
