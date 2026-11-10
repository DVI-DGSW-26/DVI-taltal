"use client";

import { Suspense, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { FloatingActions } from "@/components/FloatingActions";
import { LogoutButton } from "@/components/LogoutButton";
import { Sidebar, menuLabel, useActiveMenu } from "@/components/Sidebar";

function baseTitle(pathname: string): string {
  if (pathname.startsWith("/admin")) return "관리";
  if (pathname.startsWith("/programs/")) return "공고 상세";
  return "지원사업 검색";
}

function ScreenTitle() {
  const pathname = usePathname();
  const active = useActiveMenu();
  return <>{menuLabel(active) ?? baseTitle(pathname)}</>;
}

export function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/login") return <>{children}</>;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sidebar-scope bg-surface sticky top-0 z-40 flex h-24 items-center justify-between gap-6 px-6">
          <h1 className="text-fg min-w-0 truncate text-3xl font-bold">
            <Suspense fallback={baseTitle(pathname)}>
              <ScreenTitle />
            </Suspense>
          </h1>
          <div className="flex shrink-0 items-center gap-1">
            <LogoutButton />
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1800px] flex-1 p-6">{children}</main>
        <footer className="text-fg-subtle mx-auto w-full max-w-[1800px] px-6 py-8 text-center text-xs">
          탈탈 · 지원사업은 매일 자동 수집됩니다. 모든 시각은 KST 기준입니다.
        </footer>
      </div>
      <FloatingActions />
    </div>
  );
}
