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

  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.search = pathname && pathname !== "/" ? `?from=${encodeURIComponent(pathname)}` : "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg|login|api/auth).*)"],
};
