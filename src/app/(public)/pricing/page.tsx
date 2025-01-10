import dynamic from "next/dynamic";

import BlockPricing from "@/components/block/BlockPricing";
import { getMetadata } from "@/utils/metadata";

const DynamicBlockFAQs = dynamic(() => import("@/components/block/BlockFAQs"));
const DynamicBlockGetStartedNow = dynamic(
  () => import("@/components/block/BlockGetStartedNow"),
);
const DynamicBlockTryYourDemo = dynamic(
  () => import("@/components/block/BlockTryYourDemo"),
);

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
      <BlockPricing />
      <DynamicBlockTryYourDemo />
      <DynamicBlockFAQs />
      <DynamicBlockGetStartedNow />
    </>
  );
}
