export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl animate-pulse space-y-6">
      <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-800" />
      <div className="flex gap-1.5">
        <div className="h-5 w-12 rounded-full bg-gray-200 dark:bg-gray-800" />
        <div className="h-5 w-14 rounded-full bg-gray-200 dark:bg-gray-800" />
      </div>
      <div className="h-8 w-4/5 rounded bg-gray-200 dark:bg-gray-800" />
      <div className="h-10 w-40 rounded-lg bg-gray-200 dark:bg-gray-800" />
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-12 rounded bg-gray-200 dark:bg-gray-800" />
        ))}
      </div>
    </div>
  );
}
