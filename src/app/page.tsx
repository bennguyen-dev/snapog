import { headers } from "next/headers";

import {
  BlockCompareOGImage,
  BlockGetStartedNow,
  BlockHowItWorks,
  BlockInputDemo,
} from "@/components/block";
import { IGetDemoResponse } from "@/sevices/demo";

export default function Home() {
  const headersList = headers();

  const host = headersList.get("host");

  const initPageInfo: IGetDemoResponse[] = [
    {
      url: "https://stripe.com",
      smartOgImageBase64: "/demo/stripe-home.png",
      title: "Stripe | Financial Infrastructure to Grow Your Revenue",
      description:
        "Stripe powers online and in-person payment processing and financial solutions for businesses of all sizes. Accept payments, send payouts, and automate financial processes with a suite of APIs and no-code tools.",
      ogImage: "/demo/default-stripe-home.png",
    },
    {
      url: "https://stripe.com/payments",
      smartOgImageBase64: "/demo/stripe-payments.png",
      title: "Stripe Payments | Global Payment Processing Platform",
      description:
        "Capture more revenue with a unified payments solution that eliminates the need for one-off merchant account, payment gateway, and processor integrations.",
      ogImage: "/demo/default-stripe-payments.png",
    },
    {
      url: "https://stripe.com/pricing",
      smartOgImageBase64: "/demo/stripe-pricing.png",
      title: "Pricing & Fees | Stripe Official Site",
      description:
        "Find Stripe fees and pricing information. Find our processing fees for credit cards, pricing models and pay-as-you-go fees for businesses.",
      ogImage: "/demo/default-stripe-pricing.jpg",
    },
  ];

  return (
    <>
      <BlockInputDemo />
      <BlockCompareOGImage pagesInfo={initPageInfo} loading={false} />
      <BlockHowItWorks host={host} />
      <BlockGetStartedNow />
    </>
  );
}
