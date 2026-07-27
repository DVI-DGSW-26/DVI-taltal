"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogIn } from "lucide-react";
import { Logo } from "@/components/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const b = (await res.json().catch(() => ({}))) as { detail?: string };
        setError(b.detail ?? "로그인에 실패했습니다.");
        setLoading(false);
        return;
      }
      const from = new URLSearchParams(window.location.search).get("from") || "/";
      router.replace(from);
      router.refresh();
    } catch {
      setError("네트워크 오류가 발생했습니다.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <Logo height={140} />
          <p className="text-sm text-gray-500">지원사업 검색 · 로그인</p>
        </div>

        <form
          onSubmit={submit}
          className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">아이디</span>
            <input
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none dark:border-gray-700 dark:bg-gray-950"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">비밀번호</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none dark:border-gray-700 dark:bg-gray-950"
            />
          </label>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-brand-500 hover:bg-brand-600 inline-flex w-full items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-60"
          >
            {loading ? (
              <Loader2 size={18} aria-hidden className="animate-spin" />
            ) : (
              <LogIn size={18} aria-hidden />
            )}
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}
