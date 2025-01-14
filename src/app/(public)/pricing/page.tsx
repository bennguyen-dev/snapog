import dynamic from "next/dynamic";

import BlockPricing from "@/components/block/BlockPricing";
import { generateSchema, getMetadata } from "@/utils/metadata";

const DynamicBlockFAQs = dynamic(() => import("@/components/block/BlockFAQs"));
const DynamicBlockGetStartedNow = dynamic(
  () => import("@/components/block/BlockGetStartedNow"),
);
const DynamicBlockTryYourDemo = dynamic(
  () => import("@/components/block/BlockTryYourDemo"),
);

export const runtime = "edge";

export async function generateMetadata() {
  return getMetadata({
    title: "SnapOG Pricing - Simple Plans for Every Business",
    description:
      "Choose the perfect plan for your business. Simple, transparent pricing with all the features you need to boost social engagement.",
    path: "/pricing",
  });
}

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateSchema({
              type: "WebPage",
              title: "SnapOG Pricing - Simple Plans for Every Business",
              description:
                "Choose the perfect plan for your business. Simple, transparent pricing with all the features you need to boost social engagement.",
              path: "/pricing",
              dateModified: new Date().toISOString(),
            }),
          ),
        }}
      />
      <BlockPricing />
      <DynamicBlockTryYourDemo />
      <DynamicBlockFAQs />
      <DynamicBlockGetStartedNow />
    </>
  );
}
