/**
 * GET /api/auth/login — 사내 통합 로그인(Keycloak) 시작
 *
 * 예전의 공유 계정 POST 로그인을 대체한다. state · nonce · code_verifier 는
 * 서명한 임시 쿠키에 담아 두고 callback 에서 대조한다.
 */
import { NextResponse, type NextRequest } from "next/server";
import { signPayload } from "@/lib/auth";
import { PENDING_COOKIE, discover, pkceChallenge, randomString, safePath } from "@/lib/oidc";

export async function GET(req: NextRequest) {
  const issuer = process.env.OIDC_ISSUER ?? "";
  const clientId = process.env.OIDC_CLIENT_ID ?? "taltal";
  if (!issuer || !process.env.AUTH_SECRET) {
    return NextResponse.json(
      { detail: "서버 환경변수(OIDC_ISSUER / AUTH_SECRET)가 설정되지 않았습니다." },
      { status: 500 },
    );
  }

  const meta = await discover(issuer);

  const state = randomString(24);
  const nonce = randomString(24);
  const verifier = randomString(48);
  const next = safePath(req.nextUrl.searchParams.get("next"));

  // 로그인 진행 상태는 10분만 유효하다
  const pending = await signPayload({
    state,
    nonce,
    verifier,
    next,
    exp: Math.floor(Date.now() / 1000) + 600,
  });

  const auth = new URL(meta.authorization_endpoint);
  auth.searchParams.set("response_type", "code");
  auth.searchParams.set("client_id", clientId);
  auth.searchParams.set("redirect_uri", `${req.nextUrl.origin}/api/auth/callback`);
  auth.searchParams.set("scope", "openid profile email");
  auth.searchParams.set("state", state);
  auth.searchParams.set("nonce", nonce);
  auth.searchParams.set("code_challenge", await pkceChallenge(verifier));
  auth.searchParams.set("code_challenge_method", "S256");

  const res = NextResponse.redirect(auth.toString(), 302);
  res.cookies.set(PENDING_COOKIE, pending, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 600,
  });
  return res;
}
