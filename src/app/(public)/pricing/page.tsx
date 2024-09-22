import { BlockFAQs } from "@/components/block/BlockFAQs";
import { BlockGetStartedNow } from "@/components/block/BlockGetStartedNow";
import { BlockPricing } from "@/components/block/BlockPricing";

export default function PricingPage() {
  return (
    <>
      <BlockPricing />
      <BlockFAQs />
      <BlockGetStartedNow />
    </>
  );
}
