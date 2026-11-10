import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CrawlPanel } from "@/components/admin/CrawlPanel";
import { SourcesPanel } from "@/components/admin/SourcesPanel";
import { CategoryManager } from "@/components/admin/CategoryManager";
import { BlacklistManager } from "@/components/admin/BlacklistManager";

export const metadata: Metadata = {
  title: "관리",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <div className="space-y-2">
        <Link
          href="/"
          className="text-fg-muted hover:text-fg inline-flex items-center gap-1.5 text-sm"
        >
          <ArrowLeft size={16} aria-hidden />
          목록으로
        </Link>
        <p className="text-fg-muted text-sm">수집 실행, 카테고리 분류, 숨긴 공고를 관리합니다.</p>
      </div>

      <CrawlPanel />
      <SourcesPanel />
      <CategoryManager />
      <BlacklistManager />
    </div>
  );
}
