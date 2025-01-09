import { ReactNode } from "react";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { Inter as FontSans } from "next/font/google";
import Head from "next/head";
import { headers } from "next/headers";
import Script from "next/script";

import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/utils";
import { getMetadata } from "@/utils/metadata";
import "./globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export async function generateMetadata() {
  const headersList = headers();
  const pathname = headersList.get("x-current-path");
  const domain = process.env.NEXT_PUBLIC_VERCEL_DOMAIN || "snapog.com";

  return {
    ...getMetadata({ path: pathname || "" }),
    applicationName: "SnapOG",
    generator: "SnapOG",
    referrer: "origin-when-cross-origin",
    authors: [{ name: "SnapOG", url: `https://${domain}` }],
    category: "Open Graph",
    keywords: [
      "Open Graph",
      "Open Graph images",
      "automated social images",
      "no-code solutions",
      "boost CTR",
      "engage social media",
      "OG images",
      "SnapOG",
      "SnapOG Generator",
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
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/logo.svg" />
        <link rel="mask-icon" href="/logo.svg" color="#FFFFFF" />
        <link rel="shortcut icon" href="/logo.svg" />
        <link rel="text/plain" href="/humans.txt" />
      </Head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        {/* Load the Hotjar script before the page is interactive. */}
        {process.env.NODE_ENV === "production" && process.env.HOTJAR_ID && (
          <Script id="hotjar">
            {`
          (function (h, o, t, j, a, r) {
            h.hj =
              h.hj ||
              function () {
                // eslint-disable-next-line prefer-rest-params
                (h.hj.q = h.hj.q || []).push(arguments);
              };
            h._hjSettings = { hjid: ${process.env.HOTJAR_ID}, hjsv: 6 };
            a = o.getElementsByTagName("head")[0];
            r = o.createElement("script");
            r.async = 1;
            r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
            a.appendChild(r);
          })(window, document, "https://static.hotjar.com/c/hotjar-", ".js?sv=");
        `}
          </Script>
        )}
        <SpeedInsights />
        <Analytics />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
