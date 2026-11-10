export function ProgramCardSkeleton() {
  return (
    <li className="border-edge bg-surface animate-pulse rounded-xl border p-4">
      <div className="flex gap-1.5">
        <div className="bg-surface-3 h-5 w-12 rounded-full" />
        <div className="bg-surface-3 h-5 w-14 rounded-full" />
      </div>
      <div className="bg-surface-3 mt-3 h-5 w-3/4 rounded-md" />
      <div className="bg-surface-3 mt-2 h-4 w-full rounded-md" />
      <div className="bg-surface-3 mt-1.5 h-4 w-2/3 rounded-md" />
      <div className="bg-surface-3 mt-4 h-4 w-1/2 rounded-md" />
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
