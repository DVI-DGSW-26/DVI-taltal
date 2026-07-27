import Link from "next/link";
import { Building2, CalendarClock, Coins } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { FavoriteButton } from "@/components/FavoriteButton";
import { periodLabel, regionLabel } from "@/lib/labels";
import { deadlineTone, formatAmount, formatPeriod } from "@/lib/format";
import type { Program } from "@/lib/types";

const TONE_BADGE = {
  closed: "gray",
  urgent: "red",
  soon: "amber",
  normal: "green",
  none: "gray",
} as const;

export function ProgramCard({
  program,
  categoryLabels,
  onOpen,
}: {
  program: Program;
  categoryLabels: Record<string, string>;
  onOpen: (program: Program) => void;
}) {
  const { tone, label } = deadlineTone(program.application_end_at);
  const amount = formatAmount(program.support_amount_max) ?? program.support_amount_text;
  const period =
    formatPeriod(program.application_start_at, program.application_end_at) ||
    program.application_period_text ||
    periodLabel(program.application_period_type);

  return (
    <li className="group relative rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-start justify-between gap-2">
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
        </div>
        <div className="relative z-10 -mt-1 -mr-1 shrink-0">
          <FavoriteButton programId={program.id} isFavorite={program.is_favorite} />
        </div>
      </div>

      <h3 className="mt-2 text-base leading-snug font-semibold">
        <Link
          href={`/programs/${program.id}`}
          onClick={(e) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
            e.preventDefault();
            onOpen(program);
          }}
          className="hover:text-brand-600 line-clamp-2 after:absolute after:inset-0"
        >
          {program.title}
        </Link>
      </h3>

      <dl className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-1.5">
          <Building2 size={17} aria-hidden className="shrink-0 text-gray-400" />
          <dt className="sr-only">기관</dt>
          <dd>{program.organization}</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <CalendarClock size={17} aria-hidden className="shrink-0 text-gray-400" />
          <dt className="sr-only">신청기간</dt>
          <dd>{period}</dd>
        </div>
        {amount && (
          <div className="flex items-center gap-1.5">
            <Coins size={17} aria-hidden className="shrink-0 text-gray-400" />
            <dt className="sr-only">지원금</dt>
            <dd>{amount}</dd>
          </div>
        )}
      </dl>

      {label && (
        <div className="mt-3">
          <Badge tone={TONE_BADGE[tone]}>{label}</Badge>
        </div>
      )}
    </li>
  );
}
