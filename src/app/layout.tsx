import type { Metadata, Viewport } from "next";
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
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0b" },
  ],
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <Providers>
          <AppChrome>{children}</AppChrome>
          {modal}
        </Providers>
      </body>
    </html>
  );
}
