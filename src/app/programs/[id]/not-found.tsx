import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center">
      <h2 className="text-lg font-semibold">공고를 찾을 수 없습니다</h2>
      <p className="text-sm text-gray-500">이미 마감되었거나 삭제된 공고일 수 있습니다.</p>
      <Link
        href="/"
        className="bg-brand-500 hover:bg-brand-600 rounded-lg px-4 py-2 text-sm font-medium text-white"
      >
        목록으로 돌아가기
      </Link>
    </div>
  );
}
