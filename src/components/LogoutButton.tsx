"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

const noopSubscribe = () => () => {};

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

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
        className="text-fg-muted hover:bg-surface-2 hover:text-fg disabled:text-fg-faint inline-flex h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold disabled:cursor-not-allowed"
      >
        <LogOut size={18} aria-hidden />
        <span className="hidden sm:inline">로그아웃</span>
      </button>

      {mounted &&
        confirming &&
        createPortal(
          <div
            role="presentation"
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4 dark:bg-black/60"
            onClick={() => setConfirming(false)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="logout-confirm-title"
              onClick={(e) => e.stopPropagation()}
              className="border-edge bg-surface w-full max-w-[400px] rounded-2xl border p-6 shadow-xl"
            >
              <h2 id="logout-confirm-title" className="text-fg text-xl font-semibold">
                로그아웃 하시겠습니까?
              </h2>
              <p className="text-fg-muted mt-2 text-sm">
                다시 로그인해야 서비스를 이용할 수 있습니다.
              </p>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  className="border-line-strong bg-surface text-fg-muted hover:bg-surface-2 hover:text-fg inline-flex h-10 items-center gap-1.5 rounded-md border px-4 text-sm font-semibold"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={logout}
                  disabled={loading}
                  className="bg-danger hover:bg-danger-hover disabled:bg-surface-3 disabled:text-fg-faint inline-flex h-10 items-center gap-1.5 rounded-md px-4 text-sm font-semibold text-white disabled:cursor-not-allowed"
                >
                  로그아웃
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
