import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/components/providers";
import { AppChrome } from "@/components/AppChrome";

const themeInit = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme='light';}})();`;

export const metadata: Metadata = {
  title: {
    default: "탈탈 — 지원사업 검색",
    template: "%s · 탈탈",
  },
  description: "매일 수집한 정부·지자체 지원사업 공고를 지역·카테고리·신청기간으로 검색하는 서비스",
  applicationName: "탈탈",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#161a21" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="bg-canvas text-fg min-h-screen antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <Providers>
          <AppChrome>{children}</AppChrome>
        </Providers>
        {/* 사내 공통 "서비스 이동" 버튼 (왼쪽 아래). 서비스 목록은 서비스 허브가 관리한다.
            오른쪽 아래는 FloatingActions 가 쓰고 있어 기본 위치(왼쪽)를 그대로 쓴다. */}
        <Script src="https://dvi-service-hub.vercel.app/switcher.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
