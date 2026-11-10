"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Heart, Search, Settings, type LucideIcon } from "lucide-react";
import { Logo } from "@/components/Logo";

type MenuKey = "search" | "bookmark" | "admin";

const MENU: { key: MenuKey; label: string; href: string; icon: LucideIcon }[] = [
  { key: "search", label: "지원사업 검색", href: "/", icon: Search },
  { key: "bookmark", label: "북마크", href: "/?favorite=true", icon: Heart },
  { key: "admin", label: "관리", href: "/admin", icon: Settings },
];

/** 현재 화면에 해당하는 메뉴. 북마크는 목록 화면의 관심 필터(favorite=true)다. */
export function useActiveMenu(): MenuKey | null {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  if (pathname.startsWith("/admin")) return "admin";
  if (pathname === "/") return searchParams.get("favorite") === "true" ? "bookmark" : "search";
  return null;
}

export function menuLabel(key: MenuKey | null): string | null {
  return MENU.find((m) => m.key === key)?.label ?? null;
}

function ActiveSidebarNav() {
  return <SidebarNav active={useActiveMenu()} />;
}

/** 검색 파라미터를 읽기 전(첫 렌더)에는 경로만으로 활성 메뉴를 정한다 */
function FallbackSidebarNav() {
  const pathname = usePathname();
  const active: MenuKey | null = pathname.startsWith("/admin")
    ? "admin"
    : pathname === "/"
      ? "search"
      : null;
  return <SidebarNav active={active} />;
}

function SidebarNav({ active }: { active: MenuKey | null }) {
  return (
    <>
      {MENU.map(({ key, label, href, icon: Icon }) => {
        const isActive = active === key;
        return (
          <Link
            key={key}
            href={href}
            title={label}
            aria-current={isActive ? "page" : undefined}
            className={`flex h-12 items-center justify-center gap-3 rounded-lg px-3 text-[0.9375rem] lg:justify-start ${
              isActive
                ? "bg-brand text-on-brand font-bold shadow-md"
                : "text-fg-muted hover:bg-surface-2 hover:text-fg font-semibold"
            }`}
          >
            <Icon className="size-5 shrink-0" strokeWidth={2} aria-hidden />
            <span className="hidden truncate lg:inline">{label}</span>
          </Link>
        );
      })}
    </>
  );
}

export function Sidebar() {
  return (
    <aside className="sidebar-scope bg-surface border-line sticky top-0 flex h-screen w-[72px] shrink-0 flex-col border-r lg:w-64">
      <div className="flex h-24 items-center justify-center px-3 lg:px-4">
        <Link href="/" className="flex items-center" aria-label="탈탈 홈">
          <Logo height={64} className="h-10 w-auto lg:h-16" />
        </Link>
      </div>
      <nav
        aria-label="메뉴"
        className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 pb-4 lg:px-4"
      >
        <Suspense fallback={<FallbackSidebarNav />}>
          <ActiveSidebarNav />
        </Suspense>
      </nav>
    </aside>
  );
}
