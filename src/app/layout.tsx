import { ReactNode } from "react";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { Inter as FontSans } from "next/font/google";
import { headers } from "next/headers";

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
  const time = new Date().getTime();

  return {
    title: "Snap OG - Automate your Open-Graph social images with screenshots",
    description:
      "Boost CTR with Snap OG's No-Code Solution. Automate Open-Graph social images for better engagement and clicks. Perfect for marketers—no coding needed.",
    applicationName: "Snap OG",
    generator: "Snap OG",
    referrer: "origin-when-cross-origin",
    openGraph: {
      siteName: "Snap OG",
      images: [
        {
          url: `https://${host}/api/get-image?url=${host}${pathname}&time=${time}`,
          width: 1200,
          height: 630,
          alt: "Snap OG",
        },
      ],
      type: "website",
      locale: "en",
      description:
        "Boost CTR with Snap OG's No-Code Solution. Automate Open-Graph social images for better engagement and clicks. Perfect for marketers—no coding needed.",
      title:
        "Snap OG - Automate your Open-Graph social images with screenshots",
      url: `https://${host}${pathname}`,
    },
    authors: [{ name: "Snap OG", url: `https://${host}` }],
    category: "Open Graph",
    keywords: [
      "Open Graph",
      "Open Graph images",
      "automated social images",
      "no-code solutions",
      "boost CTR",
      "engage social media",
      "OG images",
      "Snap OG",
      "Snap OG Generator",
      "Social media optimization",
      "image automation tools",
      "enhance click-through rates",
      "visual content tools",
      "marketing automation",
    ],
    creator: "Ben Nguyen",
    publisher: "Ben Nguyen",
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
        <SpeedInsights />
        <Analytics />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
