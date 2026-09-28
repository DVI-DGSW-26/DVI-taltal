/**
 * POST /api/auth/logout — 이 서비스의 세션만 끝낸다.
 *
 * SSO 세션은 건드리지 않는다 (행사 아카이브와 같은 관례). 브라우저의
 * SSO 세션이 살아 있으면 다음 접속에서 로그인 화면 없이 다시 들어와진다
 * — 고장이 아니라 통합 로그인의 동작이다. 전부 끊고 싶으면 서비스
 * 허브의 "전체 로그아웃"을 쓴다.
 */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE } from "@/lib/auth";

export async function POST() {
  const jar = await cookies();
  jar.delete(AUTH_COOKIE);
  return NextResponse.json({ ok: true });
}
