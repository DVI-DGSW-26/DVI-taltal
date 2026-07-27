import type { ReactNode } from "react";

type BadgeTone = "gray" | "brand" | "green" | "amber" | "red";

const TONE: Record<BadgeTone, string> = {
  gray: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200",
  brand: "bg-brand-100 text-brand-700 dark:bg-brand-700/30 dark:text-brand-100",
  green: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200",
  amber: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  red: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
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
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${TONE[tone]}`}
    >
      {children}
    </span>
  );
}
