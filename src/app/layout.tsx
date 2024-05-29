import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";

import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/header";
import { ReactNode } from "react";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: " Automate OG Social Images | Boost CTR with No Code",
  description:
    "Automate your open-graph social images effortlessly. Enhance your click-through rate (CTR) with engaging and fully automated OG images. No coding required",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Header />
        <main className="container flex min-h-screen flex-col items-center justify-between">
          {children}
        </main>
      </body>
    </html>
  );
}
