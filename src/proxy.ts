import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE, verifyPayload, type Session } from "@/lib/auth";

export async function proxy(req: NextRequest) {
  // 사용자별 서명 세션. 예전의 "전 직원 공통 고정값" 방식을 대체했다.
  const session = await verifyPayload<Session>(req.cookies.get(AUTH_COOKIE)?.value);
  if (session) return NextResponse.next();

  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ detail: "로그인이 필요합니다." }, { status: 401 });
  }

  // 로그인 화면을 거치지 않고 바로 통합 로그인을 시작한다. SSO 세션이
  // 살아 있으면(허브 등에서 이미 로그인) 화면 없이 그대로 통과된다.
  // 실패했을 때만 /login 이 뜬다 — callback 이 /login?error=... 로
  // 보내므로 실패가 자동 재시도 루프로 이어지지 않는다.
  const url = req.nextUrl.clone();
  url.pathname = "/api/auth/login";
  url.search = pathname && pathname !== "/" ? `?next=${encodeURIComponent(pathname)}` : "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg|login|api/auth).*)"],
};
