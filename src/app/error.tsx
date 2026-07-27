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
      <h2 className="text-lg font-semibold">문제가 발생했습니다</h2>
      <p className="max-w-md text-sm text-gray-500">
        목록을 불러오는 중 오류가 났습니다. 잠시 후 다시 시도해 주세요.
      </p>
      <button
        type="button"
        onClick={reset}
        className="bg-brand-500 hover:bg-brand-600 inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white"
      >
        <RotateCcw size={16} aria-hidden />
        다시 시도
      </button>
    </div>
  );
}
