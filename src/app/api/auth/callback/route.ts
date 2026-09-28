/**
 * GET /api/auth/callback — 사내 통합 로그인 결과 처리
 *
 * 1. 임시 쿠키의 state 와 대조해 요청 위조를 막는다
 * 2. code + code_verifier 를 토큰 엔드포인트에 보내 토큰을 받는다
 * 3. iss · aud · nonce · exp 를 확인한다
 * 4. realm 역할 employee 를 확인한다 — 부서가 배정된 재직자만 쓴다
 * 5. 사용자별 서명 세션 쿠키를 심고 원래 보려던 주소로 돌려보낸다
 */
import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE, SESSION_HOURS, signPayload, verifyPayload } from "@/lib/auth";
import { PENDING_COOKIE, decodeJwt, discover, safePath, type TokenClaims } from "@/lib/oidc";

interface Pending {
  state: string;
  nonce: string;
  verifier: string;
  next: string;
  exp: number;
}

function fail(req: NextRequest, message: string) {
  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.search = `?error=${encodeURIComponent(message)}`;
  return NextResponse.redirect(url);
}

export async function GET(req: NextRequest) {
  const issuer = process.env.OIDC_ISSUER ?? "";
  const clientId = process.env.OIDC_CLIENT_ID ?? "taltal";
  const clientSecret = process.env.OIDC_CLIENT_SECRET ?? "";
  if (!issuer || !process.env.AUTH_SECRET) {
    return fail(req, "서버 환경변수가 설정되지 않았습니다. 관리자에게 문의해주세요.");
  }

  const params = req.nextUrl.searchParams;
  if (params.get("error")) {
    return fail(req, `통합 로그인에서 거절되었습니다. (${params.get("error_description") || params.get("error")})`);
  }

  const code = params.get("code");
  const state = params.get("state");
  const pending = await verifyPayload<Pending>(req.cookies.get(PENDING_COOKIE)?.value);
  if (!code || !state || !pending || pending.state !== state) {
    return fail(req, "로그인 정보가 없거나 만료되었습니다. 다시 시도해주세요.");
  }

  const meta = await discover(issuer);

  const form = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    client_id: clientId,
    redirect_uri: `${req.nextUrl.origin}/api/auth/callback`,
    code_verifier: pending.verifier,
  });
  if (clientSecret) form.set("client_secret", clientSecret);

  const tokenRes = await fetch(meta.token_endpoint, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded", accept: "application/json" },
    body: form,
  });
  if (!tokenRes.ok) {
    // 미리보기 배포는 주소가 매번 달라 redirect_uri 를 등록할 수 없다
    return fail(req, `통합 로그인 서버가 토큰 발급을 거절했습니다 (${tokenRes.status}). 운영 주소에서 시도해주세요.`);
  }

  const token = (await tokenRes.json()) as { id_token?: string; access_token?: string };
  if (!token.id_token) return fail(req, "계정 정보를 받지 못했습니다.");

  let claims: TokenClaims;
  let access: TokenClaims | null = null;
  try {
    claims = decodeJwt(token.id_token);
  } catch {
    return fail(req, "계정 정보를 해석하지 못했습니다.");
  }
  try {
    access = token.access_token ? decodeJwt(token.access_token) : null;
  } catch {
    access = null;
  }

  /* 토큰 검증 */
  const audOk = Array.isArray(claims.aud) ? claims.aud.includes(clientId) : claims.aud === clientId;
  if (!audOk) return fail(req, "이 서비스를 위해 발급된 계정 정보가 아닙니다.");
  if (claims.iss !== meta.issuer) return fail(req, "발급처가 올바르지 않습니다.");
  if (claims.nonce !== pending.nonce) return fail(req, "로그인 응답이 요청과 맞지 않습니다.");
  if (!claims.exp || claims.exp * 1000 < Date.now()) return fail(req, "계정 정보가 만료되었습니다.");
  if (!claims.sub) return fail(req, "계정 식별자가 없습니다.");

  /* 재직자 확인 — realm 역할은 보통 access token 에 실린다. 둘 다 본다 */
  const realmRoles = [
    ...(claims.realm_access?.roles ?? []),
    ...(access?.realm_access?.roles ?? []),
  ];
  if (!realmRoles.includes("employee")) {
    return fail(req, "재직 중이며 부서가 배정된 계정만 이용할 수 있습니다. 관리팀에 문의해주세요.");
  }

  /* 사용자 식별은 sub — 예전처럼 전 직원이 같은 쿠키 값을 갖지 않는다 */
  const session = await signPayload({
    sub: claims.sub,
    name: claims.name || claims.preferred_username || "사내 계정",
    email: String(claims.email || "").toLowerCase(),
    exp: Math.floor(Date.now() / 1000) + SESSION_HOURS * 3600,
  });

  const res = NextResponse.redirect(new URL(safePath(pending.next), req.nextUrl.origin), 302);
  res.cookies.set(AUTH_COOKIE, session, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_HOURS * 3600,
  });
  res.cookies.set(PENDING_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
