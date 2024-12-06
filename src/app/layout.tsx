import { ReactNode } from "react";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { Inter as FontSans } from "next/font/google";
import Head from "next/head";
import { headers } from "next/headers";
import Script from "next/script";

import { Toaster } from "@/components/ui/toaster";
import { getMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";
import "./globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export async function generateMetadata() {
  const headersList = headers();
  const pathname = headersList.get("x-current-path");
  const host = headersList.get("host");

  return {
    ...getMetadata({ host, path: pathname || "" }),
    applicationName: "Snap OG",
    generator: "Snap OG",
    referrer: "origin-when-cross-origin",
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
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="mask-icon" href="/logo.png" color="#0f172a" />
        <link rel="shortcut icon" href="/logo.png" />
        <link rel="text/plain" href="/humans.txt" />
      </Head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        {/* Load the Lemon Squeezy's Lemon.js script before the page is interactive. */}
        <Script
          src="https://app.lemonsqueezy.com/js/lemon.js"
          strategy="beforeInteractive"
        />
        <SpeedInsights />
        <Analytics />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
