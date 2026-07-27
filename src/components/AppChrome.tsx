"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Settings } from "lucide-react";
import { Logo } from "@/components/Logo";
import { FloatingActions } from "@/components/FloatingActions";
import { LogoutButton } from "@/components/LogoutButton";

export function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/login") return <>{children}</>;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-800 dark:bg-gray-950/80">
        <div className="mx-auto flex max-w-[1800px] items-center justify-between px-6 py-1.5">
          <Link href="/" className="flex items-center gap-3" aria-label="탈탈 홈">
            <Logo height={48} />
            <span className="hidden text-sm text-gray-400 sm:inline">지원사업 검색</span>
          </Link>
          <div className="flex items-center gap-1">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <Settings size={16} aria-hidden />
              <span className="hidden sm:inline">관리</span>
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1800px] px-6 py-6">{children}</main>
      <footer className="mx-auto max-w-[1800px] px-6 py-8 text-center text-xs text-gray-400">
        탈탈 · 지원사업은 매일 자동 수집됩니다. 모든 시각은 KST 기준입니다.
      </footer>
      <FloatingActions />
    </>
  );
}
