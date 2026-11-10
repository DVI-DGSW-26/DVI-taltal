export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl animate-pulse space-y-6">
      <div className="bg-surface-3 h-4 w-20 rounded-md" />
      <div className="flex gap-1.5">
        <div className="bg-surface-3 h-5 w-12 rounded-full" />
        <div className="bg-surface-3 h-5 w-14 rounded-full" />
      </div>
      <div className="bg-surface-3 h-8 w-4/5 rounded-md" />
      <div className="bg-surface-3 h-10 w-40 rounded-lg" />
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-surface-3 h-12 rounded-md" />
        ))}
      </div>
    </div>
  );
}
