const KST = "Asia/Seoul";

const WEEKDAY_KO: Record<string, string> = {
  Sun: "일",
  Mon: "월",
  Tue: "화",
  Wed: "수",
  Thu: "목",
  Fri: "금",
  Sat: "토",
};

interface KstParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  weekday: string;
}

function kstParts(iso: string): KstParts | null {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: KST,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    weekday: "short",
  });
  const p = Object.fromEntries(dtf.formatToParts(d).map((x) => [x.type, x.value]));
  return {
    year: Number(p.year),
    month: Number(p.month),
    day: Number(p.day),
    hour: Number(p.hour === "24" ? "0" : p.hour),
    minute: Number(p.minute),
    weekday: WEEKDAY_KO[p.weekday ?? ""] ?? "",
  };
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const p = kstParts(iso);
  if (!p) return "";
  return `${p.year}년 ${p.month}월 ${p.day}일 (${p.weekday})`;
}

function ampm(hour: number, minute: number): string {
  const mer = hour < 12 ? "오전" : "오후";
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${mer} ${h12}:${String(minute).padStart(2, "0")}`;
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "";
  const p = kstParts(iso);
  if (!p) return "";
  return `${p.year}년 ${p.month}월 ${p.day}일 (${p.weekday}) ${ampm(p.hour, p.minute)}`;
}

export function formatPeriod(
  start: string | null | undefined,
  end: string | null | undefined,
): string {
  const s = formatDateTime(start);
  const e = formatDateTime(end);
  if (s && e) return `${s} ~ ${e}`;
  if (e) return `~ ${e}`;
  if (s) return `${s} ~`;
  return "";
}

export function daysUntil(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const a = kstParts(iso);
  const b = kstParts(new Date().toISOString());
  if (!a || !b) return null;
  const toDayNum = (p: KstParts) => Date.UTC(p.year, p.month - 1, p.day) / 86_400_000;
  return Math.round(toDayNum(a) - toDayNum(b));
}

export type DeadlineTone = "closed" | "urgent" | "soon" | "normal" | "none";

export function deadlineTone(endIso: string | null | undefined): {
  tone: DeadlineTone;
  days: number | null;
  label: string;
} {
  const days = daysUntil(endIso);
  if (days === null) return { tone: "none", days, label: "" };
  if (days < 0) return { tone: "closed", days, label: "마감됨" };
  if (days === 0) return { tone: "urgent", days, label: "오늘 마감" };
  if (days === 1) return { tone: "urgent", days, label: "내일 마감" };
  if (days <= 3) return { tone: "urgent", days, label: `${days}일 남음` };
  if (days <= 7) return { tone: "soon", days, label: `${days}일 남음` };
  return { tone: "normal", days, label: `${days}일 남음` };
}

export function formatAmount(won: number | null | undefined): string | null {
  if (won == null || !Number.isFinite(won)) return null;
  if (won <= 0) return null;
  const eok = Math.floor(won / 100_000_000);
  const man = Math.floor((won % 100_000_000) / 10_000);
  const parts: string[] = [];
  if (eok > 0) parts.push(`${eok.toLocaleString("ko-KR")}억`);
  if (man > 0) parts.push(`${man.toLocaleString("ko-KR")}만`);
  if (parts.length === 0) return `${won.toLocaleString("ko-KR")}원`;
  return `${parts.join(" ")}원`;
}

export function formatBytes(bytes: number | null | undefined): string {
  if (bytes == null || !Number.isFinite(bytes) || bytes < 0) return "";
  const units = ["B", "KB", "MB", "GB"];
  let n = bytes;
  let i = 0;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i += 1;
  }
  return `${n.toFixed(n < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}
