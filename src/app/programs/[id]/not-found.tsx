import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center">
      <h2 className="text-xl font-semibold">공고를 찾을 수 없습니다</h2>
      <p className="text-fg-muted text-sm">이미 마감되었거나 삭제된 공고일 수 있습니다.</p>
      <Link
        href="/"
        className="bg-brand hover:bg-brand-hover text-on-brand inline-flex h-10 items-center gap-1.5 rounded-md px-4 text-sm font-semibold"
      >
        목록으로 돌아가기
      </Link>
    </div>
  );
}
