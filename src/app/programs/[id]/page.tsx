import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Building2, Coins, ExternalLink, FileText, Paperclip } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { DetailFavorite } from "@/components/DetailFavorite";
import { HideButton } from "@/components/HideButton";
import { ApiError, serverApi } from "@/lib/api";
import { recoverFilename } from "@/lib/encoding";
import { attachmentStatusLabel, categoryLabelMap, periodLabel, regionLabel } from "@/lib/labels";
import { deadlineTone, formatAmount, formatBytes, formatPeriod } from "@/lib/format";
import type { Program } from "@/lib/types";

type Params = Promise<{ id: string }>;

async function loadProgram(idRaw: string): Promise<Program> {
  const id = Number(idRaw);
  if (!Number.isInteger(id) || id < 1) notFound();
  try {
    return await serverApi.program(id);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  try {
    const program = await loadProgram(id);
    return {
      title: program.title,
      description: program.summary?.slice(0, 150),
    };
  } catch {
    return { title: "공고" };
  }
}

const TONE_BADGE = {
  closed: "gray",
  urgent: "red",
  soon: "amber",
  normal: "green",
  none: "gray",
} as const;

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-1 border-t border-gray-100 py-3 sm:grid-cols-[140px_1fr] sm:gap-4 dark:border-gray-800">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="text-sm text-gray-900 dark:text-gray-100">{children || "—"}</dd>
    </div>
  );
}

export default async function ProgramDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const [program, categories] = await Promise.all([
    loadProgram(id),
    serverApi.categories().catch(() => []),
  ]);
  const categoryLabels = categoryLabelMap(categories);
  const { tone, label } = deadlineTone(program.application_end_at);

  const businessDates = formatPeriod(program.business_start_at, program.business_end_at);
  const businessText = program.business_period_text?.trim() ?? "";
  const businessPeriod =
    businessDates || (businessText.length > 0 && businessText.length <= 40 ? businessText : "");

  const amount = formatAmount(program.support_amount_max);

  return (
    <article className="mx-auto max-w-4xl space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
      >
        <ArrowLeft size={18} aria-hidden />
        목록으로
      </Link>

      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {program.regions.map((r) => (
            <Badge key={r} tone="brand">
              {regionLabel(r)}
            </Badge>
          ))}
          {program.categories.map((c) => (
            <Badge key={c} tone="gray">
              {categoryLabels[c] ?? c}
            </Badge>
          ))}
          {label && <Badge tone={TONE_BADGE[tone]}>{label}</Badge>}
        </div>

        <div className="flex items-start justify-between gap-3">
          <h1 className="text-xl leading-snug font-bold sm:text-2xl">{program.title}</h1>
          <div className="shrink-0">
            <DetailFavorite program={program} />
          </div>
        </div>

        <p className="flex items-center gap-1.5 text-sm text-gray-500">
          <Building2 size={17} aria-hidden />
          {program.organization}
        </p>

        {program.origin_url ? (
          <a
            href={program.origin_url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-brand-500 hover:bg-brand-600 inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white"
          >
            <ExternalLink size={18} aria-hidden />
            {program.origin_is_direct ? "원문 공고 보기" : "원문 목록에서 찾기"}
          </a>
        ) : (
          <p className="text-sm text-gray-400">원문 링크가 제공되지 않는 공고입니다.</p>
        )}
      </header>

      <section>
        <h2 className="mb-1 flex items-center gap-1.5 text-base font-semibold">
          <FileText size={19} aria-hidden className="text-gray-400" />
          공고 정보
        </h2>
        <dl>
          <Row label="신청기간">
            <div className="space-y-1.5">
              <div>
                {formatPeriod(program.application_start_at, program.application_end_at) ||
                  program.application_period_text ||
                  periodLabel(program.application_period_type)}
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <Badge tone="gray">{periodLabel(program.application_period_type)}</Badge>
                {label && <Badge tone={TONE_BADGE[tone]}>{label}</Badge>}
              </div>
            </div>
          </Row>
          <Row label="사업(협약)기간">{businessPeriod}</Row>
          <Row label="지원금">
            <div className="flex flex-wrap items-center gap-2">
              {amount && (
                <span className="text-brand-600 inline-flex items-center gap-1 font-medium">
                  <Coins size={17} aria-hidden />
                  {amount}
                </span>
              )}
              <span>{program.support_amount_text}</span>
            </div>
          </Row>
          <Row label="기업부담금">
            <div className="flex flex-wrap items-center gap-2">
              {program.company_burden_rate != null && (
                <Badge tone="amber">{program.company_burden_rate}%</Badge>
              )}
              <span>{program.company_burden_text}</span>
            </div>
          </Row>
          <Row label="내용요약">
            <p className="leading-relaxed whitespace-pre-wrap">{program.summary}</p>
          </Row>
          <Row label="지원자격">
            <p className="leading-relaxed whitespace-pre-wrap">{program.support_condition}</p>
          </Row>
          {program.relevance && <Row label="분류 근거">{program.relevance}</Row>}
        </dl>
      </section>

      {program.attachments.length > 0 && (
        <section>
          <h2 className="mb-2 flex items-center gap-1.5 text-base font-semibold">
            <Paperclip size={19} aria-hidden className="text-gray-400" />
            첨부파일
            <span className="text-sm font-normal text-gray-400">
              ({program.attachments.length})
            </span>
          </h2>
          <ul className="divide-y divide-gray-100 rounded-xl border border-gray-200 dark:divide-gray-800 dark:border-gray-800">
            {program.attachments.map((att) => {
              const fileName = recoverFilename(att.file_name);
              return (
                <li key={att.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <a
                      href={att.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={fileName}
                      className="hover:text-brand-600 flex items-center gap-1.5 truncate text-sm font-medium"
                    >
                      <ExternalLink size={16} aria-hidden className="shrink-0 text-gray-400" />
                      <span className="truncate">{fileName}</span>
                    </a>
                    <p className="mt-0.5 text-xs text-gray-400">
                      원문에서 받기
                      {att.size_bytes ? ` · ${formatBytes(att.size_bytes)}` : ""}
                    </p>
                  </div>
                  <Badge tone="gray">{attachmentStatusLabel(att.status)}</Badge>
                </li>
              );
            })}
          </ul>
          <p className="mt-1.5 text-xs text-gray-400">
            첨부 파일은 서버에 보관하지 않으며, 원문 사이트에서 직접 내려받습니다.
          </p>
        </section>
      )}

      <section className="flex justify-end border-t border-gray-100 pt-4 dark:border-gray-800">
        <HideButton programId={program.id} />
      </section>
    </article>
  );
}
