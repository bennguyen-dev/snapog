import { ReactNode } from "react";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { Inter as FontSans } from "next/font/google";
import { headers } from "next/headers";

import { Footer } from "@/components/layout/footer";
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
  const time = new Date().getTime();

  return {
    title: "Smart OG | Boost CTR with No Code",
    description:
      "Automate your open-graph social images effortlessly. Enhance your click-through rate (CTR) with engaging and fully automated OG images. No coding required",
    applicationName: "Smart OG",
    generator: "Smart OG",
    referrer: "origin-when-cross-origin",
    openGraph: {
      siteName: "Smart OG",
      images: [
        {
          url: `https://og-image-develop.vercel.app/api/get-image?url=${host}${pathname}&time=${time}`,
          width: 1200,
          height: 630,
          alt: "Smart OG",
        },
      ],
      type: "website",
      locale: "en",
      description:
        "Automate your open-graph social images effortlessly. Enhance your click-through rate (CTR) with engaging and fully automated OG images. No coding required",
      title: "Smart OG | Boost CTR with No Code",
      url: `https://${host}${pathname}`,
    },
    authors: [{ name: "Smart OG", url: `https://${host}` }],
    category: "Open Graph",
    keywords: [
      "open-graph",
      "seo",
      "nextjs",
      "smart-og",
      "no-code",
      "og:image",
      "open-graph check",
      "open-graph generator",
      "open-graph image",
      "open-graph social image",
      "open-graph image generator",
      "open-graph image check",
      "open-graph image generator",
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
        <Header />
        <SpeedInsights />
        <Analytics />
        <main className="flex min-h-screen flex-col items-center overflow-x-clip pt-20">
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
