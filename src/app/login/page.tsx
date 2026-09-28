"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LogIn } from "lucide-react";
import { Logo } from "@/components/Logo";

/**
 * 사내 통합 로그인(SSO) 입구.
 *
 * 아이디/비밀번호 폼은 없다 — DVI 계정 하나로 로그인한다.
 * 오류가 없으면 버튼을 누를 필요도 없이 바로 통합 로그인으로 보낼 수
 * 있지만, 로그인 실패가 무한 리다이렉트 루프로 보이지 않도록 사람이
 * 누르는 버튼을 입구로 둔다.
 */
function LoginInner() {
  const params = useSearchParams();
  const error = params.get("error");
  const from = params.get("from") || "/";
  const loginHref = `/api/auth/login?next=${encodeURIComponent(from)}`;

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <Logo height={140} />
          <p className="text-sm text-gray-500">지원사업 검색 · 로그인</p>
        </div>

        <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-300">
              {error}
            </p>
          )}

          <a
            href={loginHref}
            className="bg-brand-500 hover:bg-brand-600 inline-flex w-full items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors"
          >
            <LogIn size={18} aria-hidden />
            DVI 계정으로 로그인
          </a>

          <p className="text-center text-xs text-gray-400">
            다른 사내 서비스와 같은 계정입니다. 로그인이 안 되면 관리팀에 문의해주세요.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginInner />
    </Suspense>
  );
}
