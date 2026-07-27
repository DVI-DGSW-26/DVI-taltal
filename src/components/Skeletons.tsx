export function ProgramCardSkeleton() {
  return (
    <li className="animate-pulse rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex gap-1.5">
        <div className="h-5 w-12 rounded-full bg-gray-200 dark:bg-gray-800" />
        <div className="h-5 w-14 rounded-full bg-gray-200 dark:bg-gray-800" />
      </div>
      <div className="mt-3 h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
      <div className="mt-2 h-4 w-full rounded bg-gray-200 dark:bg-gray-800" />
      <div className="mt-1.5 h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-800" />
      <div className="mt-4 h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-800" />
    </li>
  );
}

export function ProgramListSkeleton() {
  return (
    <ul className="grid grid-cols-1 gap-4 @[440px]:grid-cols-2 @[640px]:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <ProgramCardSkeleton key={i} />
      ))}
    </ul>
  );
}
