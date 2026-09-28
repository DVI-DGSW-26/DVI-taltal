/**
 * auth.ts — 로그인 세션 쿠키 서명·검증
 *
 * 사내 통합 로그인(SSO) 전환으로 공유 계정 방식을 걷어냈다.
 * 세션 쿠키는  base64url(JSON) + "." + base64url(HMAC-SHA256)  형태이고
 * 사용자별로 sub(계정 식별자)와 만료를 담는다 — 예전처럼 모두가 같은
 * 고정값을 갖지 않는다.
 *
 * AUTH_SECRET 은 필수다. 예전의 코드 내 기본값(fallback)은 비밀키가
 * 없는 채로 조용히 뜨는 구멍이라 제거했다.
 */

export const AUTH_COOKIE = "taltal_session";
export const SESSION_HOURS = 12;

export interface Session {
  sub: string;
  name: string;
  email: string;
  exp: number;
}

const enc = new TextEncoder();
const dec = new TextDecoder();

export function toB64url(bytes: Uint8Array): string {
  let s = "";
  for (const x of bytes) s += String.fromCharCode(x);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function fromB64url(str: string): Uint8Array {
  const s = str.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(s + "=".repeat((4 - (s.length % 4)) % 4));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function requireSecret(): string {
  const secret = process.env.AUTH_SECRET ?? "";
  if (!secret) throw new Error("AUTH_SECRET 환경변수가 필요합니다.");
  return secret;
}

const hmacKey = (secret: string) =>
  crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
    "verify",
  ]);

/** 세션(또는 로그인 진행 상태)을 서명해 쿠키 값으로 만든다 */
export async function signPayload(payload: object): Promise<string> {
  const body = toB64url(enc.encode(JSON.stringify(payload)));
  const key = await hmacKey(requireSecret());
  const sig = toB64url(new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(body))));
  return `${body}.${sig}`;
}

/** 서명과 만료를 확인한다. 유효하지 않으면 null */
export async function verifyPayload<T extends { exp: number }>(token: string | undefined): Promise<T | null> {
  if (!token || !token.includes(".")) return null;
  let secret: string;
  try {
    secret = requireSecret();
  } catch {
    return null;
  }
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  let ok = false;
  try {
    const key = await hmacKey(secret);
    ok = await crypto.subtle.verify("HMAC", key, fromB64url(sig), enc.encode(body));
  } catch {
    return null;
  }
  if (!ok) return null;
  try {
    const data = JSON.parse(dec.decode(fromB64url(body))) as T;
    if (!data.exp || data.exp * 1000 < Date.now()) return null;
    return data;
  } catch {
    return null;
  }
}
