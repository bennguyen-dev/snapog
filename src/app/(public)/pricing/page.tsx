import { headers } from "next/headers";

import { BlockFAQs } from "@/components/block/BlockFAQs";
import { BlockGetStartedNow } from "@/components/block/BlockGetStartedNow";
import { getMetadata } from "@/utils/metadata";

export async function generateMetadata() {
  const headersList = headers();
  const host = headersList.get("host");

  return getMetadata({
    title: "Snap OG Pricing - Simple Plans for Every Business",
    description:
      "Choose the perfect plan for your business. Simple, transparent pricing with all the features you need to boost social engagement.",
    host,
    path: "/pricing",
  });
}

export default function PricingPage() {
  return (
    <>
      <BlockFAQs />
      <BlockGetStartedNow />
    </>
  );
}
