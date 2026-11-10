import { Building2, Coins, ExternalLink, FileText, Paperclip } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { DetailFavorite } from "@/components/DetailFavorite";
import { HideButton } from "@/components/HideButton";
import { recoverFilename } from "@/lib/encoding";
import { attachmentStatusLabel, periodLabel, regionLabel } from "@/lib/labels";
import { deadlineTone, formatAmount, formatBytes, formatPeriod } from "@/lib/format";
import type { Program } from "@/lib/types";

const TONE_BADGE = {
  closed: "gray",
  urgent: "red",
  soon: "amber",
  normal: "green",
  none: "gray",
} as const;

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-line grid grid-cols-1 gap-1 border-t py-3 sm:grid-cols-[140px_1fr] sm:gap-4">
      <dt className="text-fg-muted text-sm font-medium">{label}</dt>
      <dd className="text-fg text-sm">{children || "—"}</dd>
    </div>
  );
}

export function ProgramDetailBody({
  program,
  categoryLabels,
  onHidden,
}: {
  program: Program;
  categoryLabels: Record<string, string>;
  onHidden?: () => void;
}) {
  const { tone, label } = deadlineTone(program.application_end_at);

  const businessDates = formatPeriod(program.business_start_at, program.business_end_at);
  const businessText = program.business_period_text?.trim() ?? "";
  const businessPeriod =
    businessDates || (businessText.length > 0 && businessText.length <= 40 ? businessText : "");

  const amount = formatAmount(program.support_amount_max);

  return (
    <div className="space-y-6">
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
          <h2 className="text-fg text-xl leading-snug font-semibold">{program.title}</h2>
          <div className="shrink-0">
            <DetailFavorite program={program} />
          </div>
        </div>

        <p className="text-fg-muted flex items-center gap-1.5 text-sm">
          <Building2 size={16} aria-hidden />
          {program.organization}
        </p>

        {program.origin_url ? (
          <a
            href={program.origin_url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-brand hover:bg-brand-hover text-on-brand inline-flex h-10 items-center gap-1.5 rounded-md px-4 text-sm font-semibold"
          >
            <ExternalLink size={18} aria-hidden />
            {program.origin_is_direct ? "원문 공고 보기" : "원문 목록에서 찾기"}
          </a>
        ) : (
          <p className="text-fg-subtle text-sm">원문 링크가 제공되지 않는 공고입니다.</p>
        )}
      </header>

      <section>
        <h2 className="text-fg mb-1 flex items-center gap-1.5 text-base font-semibold">
          <FileText size={20} aria-hidden className="text-fg-subtle" />
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
                <span className="text-brand-fg inline-flex items-center gap-1 font-medium tabular-nums">
                  <Coins size={16} aria-hidden />
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
          <h2 className="text-fg mb-2 flex items-center gap-1.5 text-base font-semibold">
            <Paperclip size={20} aria-hidden className="text-fg-subtle" />
            첨부파일
            <span className="text-fg-subtle text-sm font-normal tabular-nums">
              ({program.attachments.length})
            </span>
          </h2>
          <ul className="divide-line border-edge divide-y rounded-xl border">
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
                      className="hover:text-brand-fg flex items-center gap-1.5 truncate text-sm font-medium"
                    >
                      <ExternalLink size={16} aria-hidden className="text-fg-subtle shrink-0" />
                      <span className="truncate">{fileName}</span>
                    </a>
                    <p className="text-fg-subtle mt-0.5 text-xs">
                      원문에서 받기
                      {att.size_bytes ? ` · ${formatBytes(att.size_bytes)}` : ""}
                    </p>
                  </div>
                  <Badge tone="gray">{attachmentStatusLabel(att.status)}</Badge>
                </li>
              );
            })}
          </ul>
          <p className="text-fg-subtle mt-1.5 text-xs">
            첨부 파일은 서버에 보관하지 않으며, 원문 사이트에서 직접 내려받습니다.
          </p>
        </section>
      )}

      <section className="border-line flex justify-end border-t pt-4">
        <HideButton programId={program.id} onHidden={onHidden} />
      </section>
    </div>
  );
}
