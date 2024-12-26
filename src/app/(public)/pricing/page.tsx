import { BlockFAQs } from "@/components/block/BlockFAQs";
import { BlockGetStartedNow } from "@/components/block/BlockGetStartedNow";
import { BlockPricing } from "@/components/block/BlockPricing";
import { getMetadata } from "@/utils/metadata";

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
      <BlockFAQs />
      <BlockGetStartedNow />
    </>
  );
}
