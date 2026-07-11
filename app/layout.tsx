import type { Metadata } from "next";
import { Oswald, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import ToastContainer from "@/components/ui/Toast";

const display = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Football AI Hub — Live News, Chat & Match Predictions",
  description:
    "AI-powered football hub with news, chat assistant, match analysis, and educational betting insights. Built with Next.js and Gemini.",
  keywords: [
    "football",
    "soccer",
    "AI predictions",
    "football news",
    "match analysis",
  ],
  openGraph: {
    title: "Football AI Hub",
    description:
      "AI-powered football hub with news, chat assistant, and match analysis.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${display.variable} ${body.variable} ${mono.variable} font-body antialiased`}
      >
        <div className="flex min-h-screen w-full">
          <Sidebar />
          <div className="flex min-h-screen w-full flex-1 flex-col">
            <Header />
            <main className="flex-1 pb-24 md:pb-8">{children}</main>
          </div>
        </div>
        <MobileNav />
        <ToastContainer />
      </body>
    </html>
  );
}
