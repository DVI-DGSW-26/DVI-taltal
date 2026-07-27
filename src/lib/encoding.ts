const HANGUL = /[가-힣]/;

export function recoverFilename(name: string | null | undefined): string {
  if (!name) return name ?? "";
  if (HANGUL.test(name)) return name;

  const codes = Array.from(name, (c) => c.codePointAt(0) ?? 0);
  const hasNonAscii = codes.some((c) => c > 0x7f);
  if (!hasNonAscii || !codes.every((c) => c <= 0xff)) return name;

  try {
    const bytes = Uint8Array.from(codes);
    const decoded = new TextDecoder("euc-kr", { fatal: false }).decode(bytes);
    if (HANGUL.test(decoded) && !decoded.includes("�")) return decoded;
  } catch {
    return name;
  }
  return name;
}
