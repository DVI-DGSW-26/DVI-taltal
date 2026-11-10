"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center">
      <h2 className="text-xl font-semibold">문제가 발생했습니다</h2>
      <p className="text-fg-muted max-w-md text-sm">
        목록을 불러오는 중 오류가 났습니다. 잠시 후 다시 시도해 주세요.
      </p>
      <button
        type="button"
        onClick={reset}
        className="bg-brand hover:bg-brand-hover text-on-brand inline-flex h-10 items-center gap-1.5 rounded-md px-4 text-sm font-semibold"
      >
        <RotateCcw size={16} aria-hidden />
        다시 시도
      </button>
    </div>
  );
}
