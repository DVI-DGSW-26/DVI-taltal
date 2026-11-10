import type { ReactNode } from "react";

type BadgeTone = "gray" | "brand" | "green" | "amber" | "red";

const TONE: Record<BadgeTone, string> = {
  gray: "border-line bg-surface-2 text-fg-muted",
  brand: "border-brand-line bg-brand-soft text-brand-fg",
  green: "border-success-line bg-success-soft text-success-fg",
  amber: "border-warn-line bg-warn-soft text-warn-fg",
  red: "border-danger-line bg-danger-soft text-danger-fg",
};

export function Badge({
  children,
  tone = "gray",
  title,
}: {
  children: ReactNode;
  tone?: BadgeTone;
  title?: string;
}) {
  return (
    <span
      title={title}
      className={`inline-flex h-6 shrink-0 items-center rounded-full border px-2 text-xs font-medium whitespace-nowrap ${TONE[tone]}`}
    >
      {children}
    </span>
  );
}
