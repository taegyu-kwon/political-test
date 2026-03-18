import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "정치성향판별기",
  description: "단순한 좌우 구분을 넘어 경제·사회·성향·정보소비 네 가지 축으로 당신의 정치적 성향을 분석합니다.",
  openGraph: {
    title: "정치성향판별기",
    description: "단순한 좌우 구분을 넘어 경제·사회·성향·정보소비 네 가지 축으로 당신의 정치적 성향을 분석합니다.",
    url: "https://political-test-kr.vercel.app",
    siteName: "정치성향판별기",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
