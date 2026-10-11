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
  title: "WhalePulse Crypto Radar | Bắt Dòng Tiền Cá Mập & Biến Động Giá Realtime",
  description:
    "Dashboard theo dõi thị trường tiền điện tử phong cách Cyberpunk Terminal: Radar dòng tiền cá mập (Whale Inflow/Outflow), cảnh báo xả sàn, bảng giá coin sparklines và phân tích Onchain Smart Money.",
  keywords: [
    "Crypto Whale Alerts",
    "Bitcoin Inflow Outflow",
    "Smart Money Tracker",
    "Crypto Dashboard Cyberpunk",
    "Next.js Crypto Radar",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-[#07090e] text-slate-100 font-sans"
      >
        {children}
      </body>
    </html>
  );
}
