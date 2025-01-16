import dynamic from "next/dynamic";

import { BlockBenefit } from "@/components/block/BlockBenefit";
import BlockInputDemo from "@/components/block/BlockInputDemo";
import { IGetDemoResponse } from "@/services/demo";
import { generateSchema, getMetadata } from "@/utils/metadata";

export const runtime = "edge";

const DynamicBlockCompareOGImage = dynamic(
  () => import("@/components/block/BlockCompareOGImage/BlockCompareOGImage"),
);
const DynamicBlockHowItWorks = dynamic(
  () => import("@/components/block/BlockHowItWorks"),
);
const DynamicBlockPricing = dynamic(
  () => import("@/components/block/BlockPricing"),
);
const DynamicBlockGetStartedNow = dynamic(
  () => import("@/components/block/BlockGetStartedNow"),
);
const DynamicBlockFAQs = dynamic(() => import("@/components/block/BlockFAQs"));

export function generateMetadata() {
  return getMetadata({});
}

const schema = [
  generateSchema({
    type: "WebPage",
    path: "/",
  }),
  generateSchema({
    type: "Organization",
    description:
      "Leading provider of automated social media preview generation solutions.",
    path: "/",
  }),
];

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />
      <BlockInputDemo />
      <BlockBenefit />
      <DynamicBlockCompareOGImage pagesInfo={initPageInfo} />
      <DynamicBlockHowItWorks />
      <DynamicBlockPricing />
      <DynamicBlockGetStartedNow />
      <DynamicBlockFAQs />
      <DynamicBlockGetStartedNow />
    </>
  );
}
