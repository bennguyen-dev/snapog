import { headers } from "next/headers";

import { BlockBenefit } from "@/components/block/BlockBenefit";
import { BlockCompareOGImage } from "@/components/block/BlockCompareOGImage/BlockCompareOGImage";
import { BlockFAQs } from "@/components/block/BlockFAQs";
import { BlockGetStartedNow } from "@/components/block/BlockGetStartedNow";
import { BlockHowItWorks } from "@/components/block/BlockHowItWorks";
import { BlockInputDemo } from "@/components/block/BlockInputDemo";
import { getMetadata } from "@/lib/metadata";
import { IGetDemoResponse } from "@/services/demo";

export async function generateMetadata() {
  const headersList = headers();
  const host = headersList.get("host");

  return getMetadata({
    host,
    path: "/",
    keywords: [
      "social preview automation",
      "OG image generation",
      "social media optimization",
      "automated meta images",
      "link preview tool",
    ],
  });
}

export default async function Home() {
  const initPageInfo: IGetDemoResponse[] = [
    {
      id: "https://stripe.com",
      url: "https://stripe.com",
      SnapOgImage: "/demo/stripe-home.png",
      OGTitle: "Stripe | Financial Infrastructure to Grow Your Revenue",
      OGDescription:
        "Stripe powers online and in-person payment processing and financial solutions for businesses of all sizes. Accept payments, send payouts, and automate financial processes with a suite of APIs and no-code tools.",
      OGImage: "/demo/default-stripe-home.png",
    },
    {
      id: "https://stripe.com/docs",
      url: "https://stripe.com/payments",
      SnapOgImage: "/demo/stripe-payments.png",
      OGTitle: "Stripe Payments | Global Payment Processing Platform",
      OGDescription:
        "Capture more revenue with a unified payments solution that eliminates the need for one-off merchant account, payment gateway, and processor integrations.",
      OGImage: "/demo/default-stripe-payments.png",
    },
    {
      id: "https://stripe.com/docs",
      url: "https://stripe.com/pricing",
      SnapOgImage: "/demo/stripe-pricing.png",
      OGTitle: "Pricing & Fees | Stripe Official Site",
      OGDescription:
        "Find Stripe fees and pricing information. Find our processing fees for credit cards, pricing models and pay-as-you-go fees for businesses.",
      OGImage: "/demo/default-stripe-pricing.jpg",
    },
  ];

  return (
    <>
      <BlockInputDemo />
      <BlockBenefit />
      <BlockCompareOGImage pagesInfo={initPageInfo} />
      <BlockHowItWorks />
      <BlockGetStartedNow />
      <BlockFAQs />
      <BlockGetStartedNow />
    </>
  );
}
