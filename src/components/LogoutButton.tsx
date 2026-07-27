"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!confirming) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setConfirming(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [confirming]);

  const logout = async () => {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    router.replace("/login");
    router.refresh();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirming(true)}
        disabled={loading}
        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-60 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        <LogOut size={16} aria-hidden />
        <span className="hidden sm:inline">로그아웃</span>
      </button>

      {confirming && (
        <div
          role="presentation"
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
          onClick={() => setConfirming(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-confirm-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-5 shadow-xl dark:border-gray-800 dark:bg-gray-900"
          >
            <h2 id="logout-confirm-title" className="text-base font-semibold">
              로그아웃 하시겠습니까?
            </h2>
            <p className="mt-1.5 text-sm text-gray-500">
              다시 로그인해야 서비스를 이용할 수 있습니다.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                취소
              </button>
              <button
                type="button"
                onClick={logout}
                disabled={loading}
                className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
