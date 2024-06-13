import { ReactNode } from "react";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { Inter as FontSans } from "next/font/google";
import { headers } from "next/headers";

import { Header } from "@/components/layout/header";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

import type { Metadata } from "next";

import "./globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export async function generateMetadata(): Promise<Metadata> {
  const headersList = headers();

  const pathname = headersList.get("x-current-path");
  const host = headersList.get("host");

  return {
    title: "Smart OG | Boost CTR with No Code",
    description:
      "Automate your open-graph social images effortlessly. Enhance your click-through rate (CTR) with engaging and fully automated OG images. No coding required",
    applicationName: "Smart OG",
    openGraph: {
      images: [
        {
          url: `https://og-image-develop.vercel.app/api/get-image?url=${host}${pathname}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    authors: [{ name: "Smart OG" }],
    keywords: [
      "open-graph",
      "seo",
      "nextjs",
      "vercel",
      "smart-og",
      "no-code",
      "og:image",
    ],
    publisher: "Smart OG",
  };
}

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
        <SpeedInsights />
        <Analytics />
        <main className="container flex min-h-screen flex-col items-center justify-between">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
