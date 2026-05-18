import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "믹스콜 에디터 ver 0.1",
  description: "아이돌 공연 콜/믹스 콜표 제작 및 공유 도구",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
  openGraph: {
    title: "믹스콜 에디터 ver 0.1",
    description: "아이돌 공연 콜/믹스 콜표를 쉽게 만들고 공유해요 📣",
    url: "https://mix-call-editor.vercel.app",
    siteName: "믹스콜 에디터",
    images: [
      {
        url: "https://mix-call-editor.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "믹스콜 에디터 - 아이돌 공연 콜/믹스 콜표 제작 도구",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "믹스콜 에디터 ver 0.1",
    description: "아이돌 공연 콜/믹스 콜표를 쉽게 만들고 공유해요 📣",
    images: ["https://mix-call-editor.vercel.app/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <footer className="border-t border-gray-100 bg-white px-4 py-6 text-center text-xs leading-relaxed text-gray-400">
          <p>
            Copyrights and related rights for lyrics, images, and media belong to their respective owners.
          </p>
          <p>
            If you are a rights holder and would like content modified or removed, please contact{' '}
            <a href="mailto:grek@kakao.com" className="underline underline-offset-2 hover:text-gray-600">
              grek@kakao.com
            </a>
            .
          </p>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
