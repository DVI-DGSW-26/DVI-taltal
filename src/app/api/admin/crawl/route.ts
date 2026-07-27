import { NextResponse } from "next/server";
import { serverUrl } from "@/lib/api";

export async function POST() {
  const key = process.env.ADMIN_API_KEY;
  if (!key) {
    return NextResponse.json(
      { detail: "서버에 ADMIN_API_KEY가 설정되지 않았습니다." },
      { status: 503 },
    );
  }

  try {
    const res = await fetch(serverUrl("/admin/crawl"), {
      method: "POST",
      headers: { "X-Admin-Key": key },
      cache: "no-store",
    });
    const body = await res.json().catch(() => ({}));
    return NextResponse.json(body, { status: res.status });
  } catch {
    return NextResponse.json({ detail: "백엔드에 연결할 수 없습니다." }, { status: 502 });
  }
}
