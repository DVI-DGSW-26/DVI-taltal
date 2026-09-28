/**
 * oidc.ts — 사내 통합 로그인(Keycloak) 연동 조각
 *
 * 다른 사내 서비스(행사 아카이브·서비스 허브)와 같은 방식이다:
 * Authorization Code + PKCE(S256), 엔드포인트는 discovery 문서에서 읽는다.
 *   realm 주소:  https://api.dvi-ind.com/dauth/realms/dvi
 */
import { fromB64url, toB64url } from "@/lib/auth";

/** 로그인 진행 중(state·nonce·verifier)에만 쓰는 임시 쿠키 */
export const PENDING_COOKIE = "taltal_auth";

interface DiscoveryDoc {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  end_session_endpoint?: string;
}

export async function discover(issuer: string): Promise<DiscoveryDoc> {
  const url = `${issuer.replace(/\/+$/, "")}/.well-known/openid-configuration`;
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`통합 로그인 설정을 읽지 못했습니다 (${res.status})`);
  const meta = (await res.json()) as DiscoveryDoc;
  if (!meta.authorization_endpoint || !meta.token_endpoint) {
    throw new Error("통합 로그인 설정에 필요한 주소가 없습니다.");
  }
  return meta;
}

export function randomString(bytes = 48): string {
  const b = new Uint8Array(bytes);
  crypto.getRandomValues(b);
  return toB64url(b);
}

/** PKCE — verifier 를 SHA-256 해시해 challenge 로 만든다 (S256) */
export async function pkceChallenge(verifier: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  return toB64url(new Uint8Array(digest));
}

/**
 * JWT 본문을 읽는다.
 * 토큰 엔드포인트에서 TLS 로 직접 받은 것이라 서명 재검증은 하지 않는다.
 * 대신 호출부에서 iss · aud · nonce · exp 를 반드시 확인한다.
 */
export interface TokenClaims {
  iss?: string;
  aud?: string | string[];
  sub?: string;
  exp?: number;
  nonce?: string;
  email?: string;
  name?: string;
  preferred_username?: string;
  realm_access?: { roles?: string[] };
}

export function decodeJwt(token: string): TokenClaims {
  const payload = String(token || "").split(".")[1];
  if (!payload) throw new Error("토큰 형식이 올바르지 않습니다.");
  return JSON.parse(new TextDecoder().decode(fromB64url(payload))) as TokenClaims;
}

/** 같은 사이트 안의 경로만 허용한다 (열린 리다이렉트 방지) */
export function safePath(p: string | null): string {
  return typeof p === "string" && p.startsWith("/") && !p.startsWith("//") ? p : "/";
}
