import { headers } from "next/headers";

import { BlockFAQs } from "@/components/block/BlockFAQs";
import { BlockGetStartedNow } from "@/components/block/BlockGetStartedNow";
import { BlockPricing } from "@/components/block/BlockPricing";
import { getMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  const headersList = headers();
  const host = headersList.get("host");

  return getMetadata({
    title: "Pricing - Snap OG",
    description: "Pricing for Snap OG, the leading social preview generator.",
    host,
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
